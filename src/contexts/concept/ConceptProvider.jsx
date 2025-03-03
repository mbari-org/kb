import { use, useCallback, useEffect, useReducer, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
// import { useTheme } from "@mui/material/styles"

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptPath from '@/contexts/concept/lib/useConceptPath'
import useEditingStateDisplay from '@/contexts/concept/lib/edit/useEditingStateDisplay'
import usePendingFieldDisplay from '@/contexts/concept/lib/usePendingFieldDisplay'
import useModifyConcept from '@/contexts/concept/lib/edit/useModifyConcept'

import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import conceptState from '@/lib/kb/concept/state/conceptState'
// import useSubmitUpdates from "./lib/useSubmitUpdates"

import { CONCEPT_STATE, isStateModified } from '@/lib/kb/concept/state/conceptState'
import { INTENT } from '@/contexts/concept/lib/edit/useEditingStateDisplay'

import update from '@/contexts/concept/lib/submit/update'
import { conceptStateReducer } from '@/contexts/concept/lib/edit/conceptStateReducer'

import { isJsonEqual } from '@/lib/util'

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
  const [confirmReset, setConfirmReset] = useState(false)
  const [editing, setEditing] = useState(false)
  const [modalHasBeenDisplayed, setModalHasBeenDisplayed] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [editingState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useConceptPath(concept)
  const editingStateDisplay = useEditingStateDisplay()
  const pendingFieldDisplay = usePendingFieldDisplay()

  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset)

  const isConceptModified = useCallback(
    () => !isJsonEqual(editingState, initialState),
    [editingState, initialState]
  )

  const isFieldModified = useCallback(
    (field, index) => isStateModified(editingState, initialState, field, index),
    [editingState, initialState]
  )

  const isModified = useCallback(
    (field, index) => (field ? isFieldModified(field, index) : isConceptModified()),
    [isConceptModified, isFieldModified]
  )

  const resetConcept = useCallback(
    toState => {
      setEditing(false)
      setModal(null)

      const resetConceptConcept = { ...concept, ...toState }
      setConcept(resetConceptConcept)

      dispatch({ type: CONCEPT_STATE.INITIAL, update: toState })
    },
    [concept, setModal]
  )

  const submitUpdates = submit => {
    if (!submit) {
      resetConcept(initialState)
      return
    }

    console.log('CxINC: submitUpdates', editingState)
    update({
      concept,
      config: taxonomy.config,
      updates: editingState,
    })
  }

  useEffect(() => {
    if (!selected) {
      return
    }
    if (!editing && selected.concept !== concept?.name) {
      loadConcept(selected.concept).then(
        loadedConcept => {
          setConcept(loadedConcept)
        },
        error => showBoundary(error)
      )
      return
    }

    if (editing && (selected.panel !== 'Concepts' || selected.concept !== concept?.name)) {
      if (!isModified()) {
        setEditing(false)
        return
      }

      if (!modal) {
        if (modalHasBeenDisplayed) {
          setModalHasBeenDisplayed(false)
        } else {
          editingStateDisplay(INTENT.CONTINUE)
          setModalHasBeenDisplayed(true)
        }
        return
      }
    }
  }, [
    modal,
    concept,
    editingStateDisplay,
    editing,
    editingState,
    getConcept,
    isModified,
    loadConcept,
    modalHasBeenDisplayed,
    selectConcept,
    selectPanel,
    selected,
    setModal,
    showBoundary,
  ])

  useEffect(() => {
    if (concept) {
      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const initialState = conceptState(concept)
      setInitialState(initialState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: initialState })
    }
  }, [concept, getConceptPendingHistory])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        confirmReset,
        editing,
        editingState,
        editingStateDisplay,
        initialState,
        isModified,
        modifyConcept,
        pendingFieldDisplay,
        pendingHistory,
        resetConcept,
        setEditing,
        submitUpdates,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
