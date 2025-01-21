import { use, useCallback, useEffect, useReducer, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"

import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import conceptStateReducer from "./lib/conceptStateReducer"

import { stateForConcept } from "./lib/stateForConcept"

import useConceptPath from "./lib/useConceptPath"
import useDisplayEditingStateAlert from "./lib/useDisplayEditingStateAlert"
import useDisplayPendingEditAlert from "./lib/useDisplayPendingEditAlert"
import usePendingEdits from "./lib/usePendingEdits"
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
  const [editingState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useConceptPath(concept)

  const getPendingEdits = usePendingEdits(initialState)

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
    editingState,
    getPendingEdits,
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
  })

  const dispalyEditingStateAlert = useDisplayEditingStateAlert({
    conceptName: concept?.name,
    getPendingEdits,
    initialState,
    reset,
    editingState,
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
        dispalyEditingStateAlert()
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
    dispalyEditingStateAlert,
    editing,
    editingState,
    getConcept,
    getPendingEdits,
    loadConcept,
    modalAlert,
    modalHasBeenDiplayed,
    modified,
    selectConcept,
    selectPanel,
    selected,
    setModalAlert,
    showBoundary,
  ])

  useEffect(() => {
    const pendingEdits = getPendingEdits(editingState)
    setModified(!isEmpty(pendingEdits))
  }, [getPendingEdits, editingState])

  useEffect(() => {
    if (concept) {
      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const editingState = stateForConcept(concept)
      setInitialState(editingState)
      dispatch({ type: "INIT_STATE", payload: editingState })
    }
  }, [concept, getConceptPendingHistory])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        dispalyEditingStateAlert,
        displayPendingEditAlert,
        editing,
        editingState,
        initialState,
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
