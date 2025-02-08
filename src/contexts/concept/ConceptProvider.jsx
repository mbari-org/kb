import { use, useCallback, useEffect, useReducer, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
// import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"
import { stateForConcept } from "@/contexts/concept/lib/stateForConcept"
import useConceptPath from "@/contexts/concept/lib/useConceptPath"
import useDisplayEditingState from "@/contexts/concept/lib/useDisplayEditingState"
import useDisplayEditMedia from "@/contexts/concept/lib/useDisplayEditMedia"
import useDisplayPendingField from "@/contexts/concept/lib/useDisplayPendingField"

import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

// import useSubmitUpdates from "./lib/useSubmitUpdates"

import update from "@/contexts/concept/lib/submit/update"
import {
  CONCEPT,
  conceptStateReducer,
} from "@/contexts/concept/lib/conceptStateReducer"

import { hasPendingEdits } from "@/lib/kb/util/editingState"

const ConceptProvider = ({ children }) => {
  // const theme = useTheme()

  const { showBoundary } = useErrorBoundary()

  const { modal, setModal } = use(ModalContext)
  const { selected, selectConcept, selectPanel } = use(SelectedContext)
  const {
    // filterRanks,
    getConcept,
    getConceptPendingHistory,
    loadConcept,
    taxonomy,
    // updateConcept,
    // updateConceptName,
  } = use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [editing, setEditing] = useState(false)
  const [modalHasBeenDisplayed, setModalHasBeenDisplayed] = useState(false)
  const [modified, setModified] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [editingState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useConceptPath(concept)
  const displayEditingState = useDisplayEditingState()
  const displayEditMedia = useDisplayEditMedia()
  const displayPendingField = useDisplayPendingField()

  const modifyConcept = useCallback(
    action => {
      dispatch(action)
      // CxTBD Check if edit has restored state. See useModifyConcept.
      setModified(true)
    },
    [dispatch]
  )

  const resetState = useCallback(
    toState => {
      setEditing(false)
      setModified(false)
      setModal(null)

      const resetStateConcept = { ...concept, ...toState }
      setConcept(resetStateConcept)

      dispatch({ type: CONCEPT.INIT_STATE, update: toState })
    },
    [concept, setModal]
  )

  const submitUpdates = submit => {
    if (!submit) {
      resetState(initialState)
      return
    }

    console.log("submitUpdates")
    update({
      concept,
      config: taxonomy.config,
      updates: editingState,
    })
  }

  // const submitUpdates = useSubmitUpdates({
  //   concept,
  //   config: taxonomy.config,
  //   editingState,
  //   initialState,
  //   modified,
  //   modifyConcept,
  //   ranks: filterRanks(),
  //   resetState,
  //   selectConcept,
  //   setModal,
  //   showBoundary,
  //   theme,
  //   updateConcept,
  //   updateConceptName,
  // })

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

      if (!modal) {
        if (modalHasBeenDisplayed) {
          setModalHasBeenDisplayed(false)
        } else {
          displayEditingState()
          setModalHasBeenDisplayed(true)
        }
        return
      }
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
    modal,
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
    setModal,
    showBoundary,
  ])

  useEffect(() => {
    setModified(hasPendingEdits(initialState, editingState))
  }, [editingState, initialState])

  useEffect(() => {
    if (concept) {
      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const editingState = stateForConcept(concept)
      setInitialState(editingState)
      dispatch({ type: CONCEPT.INIT_STATE, update: editingState })
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
        resetState,
        setEditing,
        submitUpdates,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
