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
import useDisplayEditingState from "./lib/useDisplayEditingState"
import useDisplayEditMedia from "./lib/useDisplayEditMedia"
import useDisplayPendingField from "./lib/useDisplayPendingField"
import useSubmitUpdates from "./lib/useSubmitUpdates"

import { editsObject, isEmpty } from "@/lib/kb/util"

const ConceptProvider = ({ children }) => {
  const theme = useTheme()

  const { showBoundary } = useErrorBoundary()

  const { alert, setAlert } = use(ModalContext)
  const { selected, selectConcept, selectPanel } = use(SelectedContext)
  const {
    filterRanks,
    getConcept,
    getConceptPendingHistory,
    loadConcept,
    taxonomy,
    updateConcept,
    updateConceptName,
  } = use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [editing, setEditing] = useState(false)
  const [modalHasBeenDisplayed, setModalAlertHasBeenDisplayed] = useState(false)
  const [modified, setModified] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [editingState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useConceptPath(concept)
  const displayEditingState = useDisplayEditingState()
  const displayEditMedia = useDisplayEditMedia()
  const displayPendingField = useDisplayPendingField()

  const modifyConcept = useCallback(action => dispatch(action), [dispatch])

  const resetState = useCallback(
    toState => {
      setEditing(false)
      setModified(false)
      setAlert(null)

      const resetStateConcept = { ...concept, ...toState }
      setConcept(resetStateConcept)

      dispatch({ type: "INIT_STATE", update: toState })
    },
    [concept, setAlert]
  )

  const submitUpdates = useSubmitUpdates({
    concept,
    config: taxonomy.config,
    editingState,
    initialState,
    modified,
    modifyConcept,
    ranks: filterRanks(),
    resetState,
    selectConcept,
    setAlert,
    showBoundary,
    theme,
    updateConcept,
    updateConceptName,
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

      if (!alert && !modalHasBeenDisplayed) {
        displayEditingState()
        setModalAlertHasBeenDisplayed(true)
        return
      }

      if (!alert) {
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
    alert,
    concept,
    displayEditingState,
    editing,
    editingState,
    getConcept,
    loadConcept,
    modalHasBeenDisplayed,
    modified,
    selectConcept,
    selectPanel,
    selected,
    setAlert,
    showBoundary,
  ])

  useEffect(() => {
    const pendingEdits = editsObject(initialState, editingState)
    setModified(!isEmpty(pendingEdits))
  }, [editingState, initialState])

  useEffect(() => {
    if (concept) {
      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const editingState = stateForConcept(concept)
      setInitialState(editingState)
      dispatch({ type: "INIT_STATE", update: editingState })
    }
  }, [concept, getConceptPendingHistory])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        displayEditingState,
        displayEditMedia,
        displayPendingField,
        editing,
        editingState,
        initialState,
        modifyConcept,
        modified,
        pendingHistory,
        processUpdates: submitUpdates,
        resetState,
        setEditing,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
