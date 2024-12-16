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

import {
  createAlertChoices,
  createAlertErrorMessage,
  createAlertTitle,
} from "@/components/modals/alert/components"

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
  const [validation, setValidation] = useState(null)

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

  const cancelUpdates = () => {
    dispatch({ type: "INIT_STATE", payload: initialState })
    setEditing(false)
    setModified(false)
    setValidation(null)
  }

  const processUpdates = save => {
    if (!save) {
      cancelUpdates()
      return
    }

    if (!modified) {
      setEditing(false)
      setValidation(null)
      return
    }

    const config = taxonomy.config
    const updates = getCurrentUpdates(updatedState)

    validateUpdates({
      concept,
      config,
      setModalAlert,
      updateConcept,
      updates,
    }).then(updatesValidation => {
      setValidation(updatesValidation)
    })
  }

  const processResult = useCallback(
    ({ error, updatedConcept }) => {
      if (!error) {
        setEditing(false)
        setModified(false)
        setValidation(null)
        setInitialState(updatedState)

        updateTaxonomy(updatedConcept)

        dispatch({ type: "INIT_STATE", payload: updatedState })
      } else {
        setModalAlert({
          Title: createAlertTitle({
            title: "Update Error",
            type: "error",
          }),
          Message: createAlertErrorMessage({ error }),
          Choices: createAlertChoices({
            choices: ["Continue"],
            onChoice: () => {
              setInitialState(initialState)
              dispatch({ type: "INIT_STATE", payload: initialState })
              setModalAlert(null)
            },
          }),
        })
      }

      setEditing(false)
      setModified(false)
      setValidation(null)
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
    if (validation) {
      const config = taxonomy.config
      const updates = getCurrentUpdates(updatedState)
      submitUpdates({ concept, config, updates, validation }).then(
        result => {
          processResult(result)
        },
        error => showBoundary(error)
      )
    }
  }, [
    concept,
    getCurrentUpdates,
    showBoundary,
    processResult,
    taxonomy.config,
    updatedState,
    validation,
  ])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        conceptState: updatedState,
        editing,
        modified,
        processUpdates,
        setEditing,
        updateConcept,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
