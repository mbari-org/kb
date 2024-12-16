import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { useErrorBoundary } from "react-error-boundary"

import ConceptContext from "@/contexts/concept/ConceptContext"

import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import conceptStateReducer from "./lib/conceptStateReducer"

import { filterUpdates } from "./lib/filterUpdates"
import { stateForConcept } from "./lib/stateForConcept"
import { submitUpdates } from "./lib/submitUpdates"
import { validateUpdates } from "./lib/validate/validateUpdates"

import { isEmpty } from "@/lib/util"

const ConceptProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { setModalAlert } = use(ModalContext)
  const { selected, selectConcept, selectPanel } = use(SelectedContext)
  const { getConcept, loadConcept, taxonomy, updateTaxonomy } =
    use(TaxonomyContext)

  const [concept, setConcept] = useState(null)

  const [editing, setEditing] = useState(false)
  const [modified, setModified] = useState(false)
  const [validated, setValidated] = useState(false)

  const [initialState, setInitialState] = useState(null)
  const [updatedState, dispatch] = useReducer(conceptStateReducer, {})

  const getConceptPath = useCallback(
    (concept, path = [concept.name]) =>
      concept.parent
        ? getConceptPath(concept.parent, [concept.parent.name, ...path])
        : path,
    []
  )

  const conceptPath = useMemo(() => {
    if (concept) {
      return getConceptPath(concept)
    }
  }, [concept, getConceptPath])

  // filterUpdate returns a function but eslint isn't aware of that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrentUpdates = useCallback(filterUpdates(initialState), [
    initialState,
  ])

  const updateConcept = update =>
    dispatch({ type: "SET_FIELD", payload: update })

  const cancelChanges = () => {
    dispatch({ type: "INIT_STATE", payload: initialState })
    setEditing(false)
    setModified(false)
    setValidated(false)
  }

  const saveChanges = save => {
    if (!save) {
      return cancelChanges()
    }

    if (!modified) {
      setEditing(false)
      setValidated(false)
      return
    }

    const config = taxonomy.config
    const updates = getCurrentUpdates(updatedState)

    validateUpdates({
      cancelChanges,
      concept,
      config,
      setModalAlert,
      updateConcept,
      updates,
    }).then(({ alert }) => {
      if (alert) {
        setModalAlert(alert)
      } else {
        // dispatch({ type: "INIT_STATE", payload: initialState })
        // setModalAlert(null)
        // setModified(false)
        setValidated(true)
      }
    })
  }

  const processSubmissionResult = useCallback(
    ({ error, updatedConcept }) => {
      if (!error) {
        // setEditing(false)
        // setModified(false)
        // setValidated(false)

        updateTaxonomy(updatedConcept)

        setInitialState(updatedState)
        dispatch({ type: "INIT_STATE", payload: updatedState })
      } else {
        const modalAlert = {
          ...error,
          onClose: () => {
            setInitialState(initialState)
            dispatch({ type: "INIT_STATE", payload: initialState })

            setModalAlert(null)
          },
        }
        setModalAlert(modalAlert)
      }
      setEditing(false)
      setModified(false)
      setValidated(false)
    },
    [initialState, setModalAlert, updateTaxonomy, updatedState]
  )

  useEffect(() => {
    if (!selected) {
      return
    }

    if (editing && modified) {
      if (selected.concept === concept?.name && selected.panel === "Concepts") {
        return
      }
      selectConcept(concept?.name)
      selectPanel("Concepts")
      const modalAlert = {
        onClose: () => setModalAlert(null),
        message:
          "You have unsaved Concept changes. Please Cancel or Save to continue.",
        title: "Unsaved Changes",
        type: "warning",
      }

      setModalAlert(modalAlert)
    } else {
      if (selected.concept !== concept?.name) {
        loadConcept(selected.concept).then(
          () => {
            const concept = getConcept(selected.concept)
            setConcept(concept)
          },
          error => showBoundary(error)
        )
      }
    }
  }, [
    concept,
    editing,
    getConcept,
    loadConcept,
    modified,
    selectConcept,
    selectPanel,
    selected,
    setModalAlert,
    showBoundary,
  ])

  useEffect(() => {
    const hasUpdates = !isEmpty(getCurrentUpdates(updatedState))
    setModified(hasUpdates)
  }, [getCurrentUpdates, updatedState])

  useEffect(() => {
    if (concept) {
      const conceptState = stateForConcept(concept)
      setInitialState(conceptState)
      dispatch({ type: "INIT_STATE", payload: conceptState })
    }
  }, [concept])

  useEffect(() => {
    if (validated) {
      const config = taxonomy.config
      const updates = getCurrentUpdates(updatedState)
      submitUpdates(concept, updates, config).then(
        result => processSubmissionResult(result),
        error => showBoundary(error)
      )
    }
  }, [
    concept,
    getCurrentUpdates,
    showBoundary,
    processSubmissionResult,
    taxonomy.config,
    updatedState,
    validated,
  ])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        conceptState: updatedState,
        editing,
        modified,
        saveChanges,
        setEditing,
        updateConcept,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
