import { use, useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'
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

import { initialConceptState, isStateModified } from '@/lib/kb/state'

import { CONCEPT_STATE, LABELS, SELECTED } from '@/lib/constants'

const { CONTINUE } = LABELS.BUTTON

const ConceptProvider = ({ children }) => {
  const { setModalData } = use(ConceptModalContext)
  const { refreshData: refreshPanelData } = use(PanelDataContext)
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

  const displayStaged = useDisplayStaged()
  const handleLoadConceptError = useLoadConceptError()
  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset, setEditing)

  const resetConcept = useCallback(
    async resettingConcept => {
      const { pendingHistory } = await refreshPanelData('pendingHistory')
      const conceptPendingHistory = pendingHistory.filter(
        history => history.concept === resettingConcept.name
      )

      const conceptState = initialConceptState(resettingConcept, conceptPendingHistory)
      setInitialState(conceptState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: conceptState })
    },
    [refreshPanelData]
  )

  const handleSetConcept = useCallback(
    selectedConcept => {
      setConcept(selectedConcept)
      setEditing(false)

      resetConcept(selectedConcept)
    },
    [resetConcept]
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
      const hasModifications = isStateModified({ initialState, stagedState })
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
      resetConcept,
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
      resetConcept,
      stagedState,
    ]
  )

  return <ConceptContext value={value}>{children}</ConceptContext>
}

export default ConceptProvider
