import { use, useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import useLoadConceptError from '@/hooks/useLoadConceptError'
import useConceptLoader from './useConceptLoader'
import useConceptPending from './pending/useConceptPending'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'
import AppModalContext from '@/contexts/app/AppModalContext'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'

import { initialConceptState, isStateModified } from '@/lib/kb/state'

import { CONCEPT_STATE, LABELS, SELECTED } from '@/lib/constants'

const { CONTINUE } = LABELS.BUTTON

const ConceptProvider = ({ children }) => {
  const { setModalData } = use(ConceptModalContext)
  const { refreshData: refreshPanelData } = use(PanelDataContext)
  const { setProcessing: setAppProcessing, setModalData: setAppModalData } = use(AppModalContext)
  const { getSelected, panels  } = use(SelectedContext)
  const { getConcept, isConceptLoaded, loadConcept, taxonomy } = use(TaxonomyContext)
  const { hasUnsavedChanges, setHasUnsavedChanges, unsafeAction  } = use(UserContext)

  const [concept, setConcept] = useState(null)
  const [confirmReset, setConfirmReset] = useState(null)
  const [editing, setEditing] = useState(false)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useMemo(() => itemPath(taxonomy, concept), [concept, taxonomy])

  const displayStaged = useDisplayStaged()
  const handleLoadConceptError = useLoadConceptError()
  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset, setEditing)

  const { pending, setPendingConfirm } = useConceptPending(concept)

  const handleSetConcept = useCallback(
    async updatedConcept => {
      setEditing(false)

      const { pendingHistory } = await refreshPanelData('pendingHistory')
      const pendingConcept = pendingHistory.filter(
        history => history.concept === updatedConcept.name
      )

      const conceptState = initialConceptState(updatedConcept, pendingConcept)
      setInitialState(conceptState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: conceptState })

      setConcept(updatedConcept)
      // End app-level processing overlay when concept is fully set
      setAppProcessing(false)
    },
    [refreshPanelData, setAppProcessing]
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

    // Otherwise follow selection-change path
    if (shouldUpdateConcept) {
      if (hasUnsavedChanges) {
        displayStaged(CONTINUE)
        setModalData(prev => ({ ...prev, concept: selectedConcept }))
      } else {
        setHasUnsavedChanges(false)

        // Show app-level processing overlay
        setAppModalData({ processingMessage: 'Loading concept...' })
        setAppProcessing(true)

        conceptLoader(selectedConcept)
      }
    }
  }, [concept, conceptLoader, displayStaged, getConcept, getSelected, hasUnsavedChanges, isConceptLoaded, loadConcept, panels, setAppModalData, setAppProcessing, setConcept, setHasUnsavedChanges, setModalData, taxonomy])

  useEffect(() => {
    const selectedConcept = getSelected(SELECTED.CONCEPT)
    if (!selectedConcept) return
    if (!isConceptLoaded(selectedConcept)) return

    const taxonomyConcept = getConcept(selectedConcept)
    if (!taxonomyConcept) return

    handleSetConcept(taxonomyConcept)
  }, [concept, getConcept, getSelected, handleSetConcept, isConceptLoaded, taxonomy])

  useEffect(() => {
    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    if (isConceptPanelActive && initialState) {
      const hasModifications = isStateModified({ initialState, stagedState })
      setHasUnsavedChanges(hasModifications)
    } else {
      setHasUnsavedChanges(false)
    }
  }, [initialState, stagedState, panels, setHasUnsavedChanges])

  useEffect(() => {
    if (!unsafeAction) return

    displayStaged(CONTINUE)
    setModalData(prev => ({ ...prev, unsafeAction }))
  }, [unsafeAction, displayStaged, setModalData])

  const value = useMemo(
    () => ({
      concept,
      conceptPath,
      confirmReset,
      editing,
      initialState,
      modifyConcept,
      pending,
      setConcept: handleSetConcept,
      setEditing,
      setPendingConfirm,
      stagedState,
    }),
    [
      concept,
      conceptPath,
      confirmReset,
      editing,
      handleSetConcept,
      initialState,
      modifyConcept,
      pending,
      setEditing,
      setPendingConfirm,
      stagedState,
    ]
  )

  return <ConceptContext value={value}>{children}</ConceptContext>
}

export default ConceptProvider
