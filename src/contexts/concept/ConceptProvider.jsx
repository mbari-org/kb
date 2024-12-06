import { use, useCallback, useEffect, useReducer, useState } from "react"
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

const ConceptProvider = ({ children, _concept }) => {
  const { showBoundary } = useErrorBoundary()

  const { setModalAlert } = use(ModalContext)
  const { getConcept, taxonomy, updateConcept } = use(TaxonomyContext)
  const { selected } = use(SelectedContext)

  const concept = getConcept(selected.concept)

  const [editable, setEditable] = useState(false)
  const [isModified, setIsModified] = useState(false)
  const [validated, setValidated] = useState(false)

  const [initialState, setInitialState] = useState(null)
  const [updatedState, dispatch] = useReducer(conceptStateReducer, {})

  // the next line is bc filterUpdate returns a function but eslint isn't aware of that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrentUpdates = useCallback(filterUpdates(initialState), [
    initialState,
  ])

  const setConcept = update => dispatch({ type: "SET_FIELD", payload: update })

  const saveChanges = save => {
    setEditable(false)

    if (save && isModified) {
      const config = taxonomy.config
      const updates = getCurrentUpdates(updatedState)

      validateUpdates(concept, updates, config).then(({ alert }) => {
        if (!alert) {
          setValidated(true)
        } else {
          dispatch({ type: "INIT_STATE", payload: initialState })
          setIsModified(false)
          setModalAlert(alert)
        }
      })
    } else if (!save) {
      dispatch({ type: "INIT_STATE", payload: initialState })
      setIsModified(false)
    }
  }

  const submissionResult = useCallback(
    ({ error, updatedConcept }) => {
      if (!error) {
        updateConcept(updatedConcept, taxonomy)
        setInitialState(updatedState)
      } else {
        setModalAlert(error)
        setInitialState(initialState)
        dispatch({ type: "INIT_STATE", payload: initialState })
      }
      setEditable(false)
      setIsModified(false)
      setValidated(false)
    },
    [initialState, setModalAlert, taxonomy, updateConcept, updatedState]
  )

  useEffect(() => {
    const hasUpdates = !isEmpty(getCurrentUpdates(updatedState))
    setIsModified(hasUpdates)
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
        conceptState: updatedState,
        editable,
        isModified,
        saveChanges,
        setConcept,
        setEditable,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
