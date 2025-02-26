import { use, useCallback, useEffect, useReducer, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
// import { useTheme } from "@mui/material/styles"

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptPath from '@/contexts/concept/lib/useConceptPath'
import useEditingStateDisplay from '@/contexts/concept/lib/useEditingStateDisplay'
import useEditMediaDisplay from '@/contexts/concept/lib/useEditMediaDisplay'
import usePendingFieldDisplay from '@/contexts/concept/lib/usePendingFieldDisplay'

import useModifyConcept from '@/contexts/concept/lib/useModifyConcept'
import useResetConcept from '@/contexts/concept/lib/useResetConcept'

import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { conceptState } from '@/lib/kb/concept/state/concept'
// import useSubmitUpdates from "./lib/useSubmitUpdates"

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'
import { INTENT } from '@/contexts/concept/lib/useEditingStateDisplay'

import update from '@/contexts/concept/lib/submit/update'
import { conceptStateReducer } from '@/contexts/concept/lib/conceptStateReducer'

import { hasStateChange } from '@/components/kb/panels/concepts/editingState/edits/stateChange'

const ConceptProvider = ({ children }) => {
  // const theme = useTheme()

  const { showBoundary } = useErrorBoundary()

  const { data, modal, setData, setModal } = use(ModalContext)
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
  const editingStateDisplay = useEditingStateDisplay()
  const editMediaDisplay = useEditMediaDisplay()
  const pendingFieldDisplay = usePendingFieldDisplay()

  const resetConcept = useResetConcept(dispatch, initialState, data, setData)
  const modifyConcept = useModifyConcept(dispatch, resetConcept)

  const resetState = useCallback(
    toState => {
      setEditing(false)
      setModified(false)
      setModal(null)

      const resetStateConcept = { ...concept, ...toState }
      setConcept(resetStateConcept)

      dispatch({ type: CONCEPT_STATE.INIT_STATE, update: toState })
    },
    [concept, setModal]
  )

  const submitUpdates = submit => {
    if (!submit) {
      resetState(initialState)
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
      if (!modified) {
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
    setModified(hasStateChange(initialState, editingState))
  }, [editingState, initialState])

  useEffect(() => {
    if (concept) {
      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const initialState = conceptState(concept)
      setInitialState(initialState)
      dispatch({ type: CONCEPT_STATE.INIT_STATE, update: initialState })
    }
  }, [concept, getConceptPendingHistory])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        editingStateDisplay,
        editMediaDisplay,
        pendingFieldDisplay,
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
