import { use, useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import useStagedModal from '@/components/kb/panels/concepts/concept/change/staged/modal/useStagedModal'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import useLoadConceptError from '@/hooks/useLoadConceptError'
import useConceptLoader from './useConceptLoader'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'

import { hasModifiedState, initialConceptState } from '@/lib/kb/state/concept'

import { CONCEPT_STATE, LABELS, SELECTED } from '@/lib/constants'

const { CONTINUE } = LABELS.BUTTON

const ConceptProvider = ({ children }) => {
  const { setModalData } = use(ConceptModalContext)
  const { pendingHistory } = use(PanelDataContext)
  const { getSelected, panels } = use(SelectedContext)
  const { getConcept, isConceptLoaded, loadConcept, taxonomy } = use(TaxonomyContext)
  const { setHasUnsavedChanges, hasUnsavedChanges } = use(UserContext)

  const [concept, setConcept] = useState(null)
  const [confirmReset, setConfirmReset] = useState(null)
  const [confirmPending, setConfirmPending] = useState(null)
  const [editing, setEditing] = useState(false)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useMemo(() => itemPath(taxonomy, concept), [concept, taxonomy])

  const displayStaged = useStagedModal()
  const handleLoadConceptError = useLoadConceptError()
  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset, setEditing)

  const refreshConcept = useCallback(
    (refreshedConcept = null, conceptPendingHistory = []) => {
      const conceptToRefresh = refreshedConcept || concept

      const refreshedInitialState = initialConceptState(conceptToRefresh, conceptPendingHistory)
      setInitialState(refreshedInitialState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: refreshedInitialState })
    },
    [concept]
  )

  const handleSetConcept = useCallback(
    selectedConcept => {
      setConcept(selectedConcept)
      setEditing(false)

      const conceptPendingHistory = pendingHistory.filter(
        history => history.concept === selectedConcept.name
      )
      refreshConcept(selectedConcept, conceptPendingHistory)
    },
    [pendingHistory, refreshConcept]
  )

  const conceptLoader = useConceptLoader({
    getConcept,
    getSelected,
    handleLoadConceptError,
    handleSetConcept,
    isConceptLoaded,
    loadConcept,
    setEditing,
  })

  // Sync hasUnsavedChanges whenever staged state changes
  useEffect(() => {
    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    if (isConceptPanelActive && initialState) {
      const hasModifications = hasModifiedState({ initialState, stagedState })
      setHasUnsavedChanges(hasModifications)
    } else {
      // Clear unsaved data flag when not on concepts panel
      setHasUnsavedChanges(false)
    }
  }, [initialState, stagedState, panels, setHasUnsavedChanges])

  // Reset editing state when leaving Concepts panel
  useEffect(() => {
    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    if (!isConceptPanelActive && editing) {
      setEditing(false)
    }
  }, [panels, editing])

  useEffect(() => {
    const selectedConcept = getSelected(SELECTED.CONCEPT)
    if (!selectedConcept) {
      setHasUnsavedChanges(false)
      return
    }

    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    const isNewConceptSelected = selectedConcept !== concept?.name
    const shouldUpdateConcept = isNewConceptSelected && isConceptPanelActive

    if (shouldUpdateConcept) {
      if (hasUnsavedChanges) {
        displayStaged(CONTINUE)
        setModalData(prev => ({ ...prev, concept: selectedConcept }))
        setHasUnsavedChanges(true)
      } else {
        setHasUnsavedChanges(false)
        conceptLoader(selectedConcept)
      }
    }
  }, [
    concept,
    conceptLoader,
    displayStaged,
    getSelected,
    hasUnsavedChanges,
    panels,
    setHasUnsavedChanges,
    setModalData,
  ])

  const value = useMemo(
    () => ({
      concept,
      conceptPath,
      confirmPending,
      confirmReset,
      editing,
      initialState,
      modifyConcept,
      refreshConcept,
      setEditing,
      setConfirmPending,
      stagedState,
    }),
    [
      concept,
      conceptPath,
      confirmPending,
      confirmReset,
      editing,
      initialState,
      modifyConcept,
      refreshConcept,
      stagedState,
    ]
  )

  return <ConceptContext value={value}>{children}</ConceptContext>
}

export default ConceptProvider
