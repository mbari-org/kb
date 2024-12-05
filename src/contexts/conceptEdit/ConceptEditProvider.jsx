import { use, useCallback, useEffect, useReducer, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

import ConceptEditContext from "@/contexts/conceptEdit/ConceptEditContext"

import ModalContext from "@/contexts/modal/ModalContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import conceptStateReducer from "./conceptStateReducer"

import { filterUpdates } from "./filterUpdates"
import { stateForConcept } from "./stateForConcept"
import { submitUpdates } from "./submitUpdates"
import { validateUpdates } from "./validateUpdates"

import { isEmpty } from "@/lib/util"

const ConceptEditProvider = ({ children, concept }) => {
  const { showBoundary } = useErrorBoundary()

  const { taxonomy, updateConcept } = use(TaxonomyContext)
  const { setModalAlert } = use(ModalContext)

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
    <ConceptEditContext
      value={{
        conceptState: updatedState,
        editable,
        isModified,
        saveChanges,
        setConcept,
        setEditable,
      }}
    >
      {children}
    </ConceptEditContext>
  )
}

export default ConceptEditProvider
