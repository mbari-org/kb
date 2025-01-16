import { use, useCallback, useEffect, useReducer, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"

import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import conceptStateReducer from "./lib/conceptStateReducer"

import { filterUpdates } from "./lib/filterUpdates"
import { stateForConcept } from "./lib/stateForConcept"

import useConceptPath from "./lib/useConceptPath"
import useDisplayConceptEditsAlert from "./lib/useDisplayConceptEditsAlert"
import useDisplayPendingEditAlert from "./lib/useDisplayPendingEditAlert"
import useSubmitUpdates from "./lib/useSubmitUpdates"

import { isEmpty } from "@/lib/kb/util"

const ConceptProvider = ({ children }) => {
  const theme = useTheme()

  const { showBoundary } = useErrorBoundary()

  const { modalAlert, setModalAlert } = use(ModalContext)
  const { selected, selectConcept, selectPanel } = use(SelectedContext)
  const {
    getConcept,
    getConceptPendingHistory,
    loadConcept,
    taxonomy,
    updateConcept,
    updateConceptName,
  } = use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [editing, setEditing] = useState(false)
  const [modalHasBeenDiplayed, setModalAlertHasBeenDisplayed] = useState(false)
  const [modified, setModified] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [updatedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useConceptPath(concept)

  // filterUpdate returns a function but eslint isn't aware of that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrentUpdates = useCallback(filterUpdates(initialState), [
    initialState,
  ])

  const modifyConcept = useCallback(
    update => {
      dispatch({ type: "SET_FIELD", payload: update })
    },
    [dispatch]
  )

  const reset = useCallback(
    resetState => {
      setEditing(false)
      setModified(false)
      setModalAlert(null)

      const resetConcept = { ...concept, ...resetState }
      setConcept(resetConcept)

      dispatch({ type: "INIT_STATE", payload: resetState })
    },
    [concept, setModalAlert]
  )

  const submitUpdates = useSubmitUpdates({
    concept,
    config: taxonomy.config,
    getCurrentUpdates,
    initialState,
    modified,
    modifyConcept,
    reset,
    selectConcept,
    setModalAlert,
    showBoundary,
    theme,
    updateConcept,
    updateConceptName,
    updatedState,
  })

  const displayConceptEditsAlert = useDisplayConceptEditsAlert({
    conceptName: concept?.name,
    getCurrentUpdates,
    initialState,
    reset,
    updatedState,
  })

  const displayPendingEditAlert = useDisplayPendingEditAlert({
    conceptName: concept?.name,
    pendingHistory,
  })

  useEffect(() => {
    if (!selected) {
      return
    }

    if (
      editing &&
      (selected.panel !== "Concepts" || selected.concept !== concept?.name)
    ) {
      if (!modified) {
        setEditing(false)
        return
      }

      if (!modalAlert && !modalHasBeenDiplayed) {
        displayConceptEditsAlert()
        setModalAlertHasBeenDisplayed(true)
        return
      }

      if (!modalAlert) {
        setModalAlertHasBeenDisplayed(false)
        return
      }

      return
    }

    if (selected.concept !== concept?.name) {
      loadConcept(selected.concept).then(
        () => {
          const concept = getConcept(selected.concept)
          setConcept(concept)
        },
        error => showBoundary(error)
      )
    }
  }, [
    concept,
    displayConceptEditsAlert,
    editing,
    getConcept,
    getCurrentUpdates,
    loadConcept,
    modalAlert,
    modalHasBeenDiplayed,
    modified,
    selectConcept,
    selectPanel,
    selected,
    setModalAlert,
    showBoundary,
    updatedState,
  ])

  useEffect(() => {
    const currentUpdates = getCurrentUpdates(updatedState)
    const hasUpdates = !isEmpty(currentUpdates)
    setModified(hasUpdates)
  }, [getCurrentUpdates, updatedState])

  useEffect(() => {
    if (concept) {
      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const conceptState = stateForConcept(concept)
      setInitialState(conceptState)
      dispatch({ type: "INIT_STATE", payload: conceptState })
    }
  }, [concept, getConceptPendingHistory])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        conceptState: updatedState,
        displayConceptEditsAlert,
        displayPendingEditAlert,
        editing,
        modifyConcept,
        modified,
        pendingHistory,
        processUpdates: submitUpdates,
        setEditing,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
