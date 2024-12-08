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
import { validateUpdates } from "./lib/validateUpdates"

import { isEmpty } from "@/lib/util"

const ConceptProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { setModalAlert } = use(ModalContext)
  const { selected } = use(SelectedContext)
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

  const saveChanges = save => {
    setEditing(false)

    if (save && modified) {
      const config = taxonomy.config
      const updates = getCurrentUpdates(updatedState)

      validateUpdates(concept, updates, config).then(({ alert }) => {
        if (!alert) {
          setValidated(true)
        } else {
          dispatch({ type: "INIT_STATE", payload: initialState })
          setModified(false)
          setModalAlert(alert)
        }
      })
    } else if (!save) {
      dispatch({ type: "INIT_STATE", payload: initialState })
      setModified(false)
    }
  }

  const submissionResult = useCallback(
    ({ error, updatedConcept }) => {
      if (!error) {
        updateTaxonomy(updatedConcept, taxonomy)
        setInitialState(updatedState)
      } else {
        setModalAlert(error)
        setInitialState(initialState)
        dispatch({ type: "INIT_STATE", payload: initialState })
      }
      setEditing(false)
      setModified(false)
      setValidated(false)
    },
    [initialState, setModalAlert, taxonomy, updateTaxonomy, updatedState]
  )

  useEffect(() => {
    if (selected && selected.concept !== concept?.name) {
      loadConcept(selected.concept).then(
        () => {
          const concept = getConcept(selected.concept)
          setConcept(concept)
        },
        error => showBoundary(error)
      )
    }
  }, [concept, getConcept, loadConcept, selected, showBoundary])

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
        result => submissionResult(result),
        error => showBoundary(error)
      )
    }
  }, [
    concept,
    getCurrentUpdates,
    showBoundary,
    submissionResult,
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
