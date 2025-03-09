import { use, useCallback, useEffect, useReducer, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
// import { useTheme } from "@mui/material/styles"

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptPath from '@/contexts/concept/lib/useConceptPath'
import useStagedStateDisplay from '@/contexts/concept/lib/edit/useStagedStateDisplay'
import usePendingFieldDisplay from '@/contexts/concept/lib/usePendingFieldDisplay'
import useModifyConcept from '@/contexts/concept/lib/edit/useModifyConcept'

import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import conceptState from '@/lib/kb/concept/state/conceptState'
// import useSubmitUpdates from "./lib/useSubmitUpdates"

import { CONCEPT_STATE, isStateModified } from '@/lib/kb/concept/state/conceptState'
import { INTENT } from '@/contexts/concept/lib/edit/useStagedStateDisplay'

import update from '@/contexts/concept/lib/submit/update'
import { conceptStateReducer } from '@/contexts/concept/lib/edit/conceptStateReducer'

import { isJsonEqual } from '@/lib/util'

const ConceptProvider = ({ children }) => {
  // const theme = useTheme()

  const { showBoundary } = useErrorBoundary()

  const { modal, closeModal } = use(ModalContext)
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
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useConceptPath(concept)
  const stagedStateDisplay = useStagedStateDisplay()
  const pendingFieldDisplay = usePendingFieldDisplay()

  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset)

  const isConceptModified = useCallback(
    () => !isJsonEqual(stagedState, initialState),
    [stagedState, initialState]
  )

  const isFieldModified = useCallback(
    (field, index) => isStateModified(stagedState, initialState, field, index),
    [stagedState, initialState]
  )

  const isModified = useCallback(
    (field, index) => {
      if (!editing) return false

      return field ? isFieldModified(field, index) : isConceptModified()
    },
    [editing, isConceptModified, isFieldModified]
  )

  const resetConcept = useCallback(
    toState => {
      setEditing(false)
      closeModal()

      const resetConceptConcept = { ...concept, ...toState }
      setConcept(resetConceptConcept)

      dispatch({ type: CONCEPT_STATE.INITIAL, update: toState })
    },
    [concept, closeModal]
  )

  const submitUpdates = submit => {
    if (!submit) {
      resetConcept(initialState)
      return
    }

    console.log('CxInc: submitUpdates', stagedState)
    update({
      concept,
      config: taxonomy.config,
      updates: stagedState,
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
          stagedStateDisplay(INTENT.CONTINUE)
          setModalHasBeenDisplayed(true)
        }
        return
      }
    }
  }, [
    modal,
    concept,
    stagedStateDisplay,
    editing,
    stagedState,
    getConcept,
    isModified,
    loadConcept,
    modalHasBeenDisplayed,
    selectConcept,
    selectPanel,
    selected,
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
        stagedState,
        stagedStateDisplay,
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
