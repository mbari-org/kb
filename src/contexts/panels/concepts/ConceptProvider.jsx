import { use, useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import useLoadConceptError from '@/hooks/useLoadConceptError'
import useConceptLoader from './useConceptLoader'
import useConceptPending from './pending/useConceptPending'

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
  const { dirtyConcept, getSelected, panels, setDirtyConcept } = use(SelectedContext)
  const { getConcept, isConceptLoaded, loadConcept, taxonomy } = use(TaxonomyContext)
  const { hasUnsavedChanges, setHasUnsavedChanges } = use(UserContext)

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

  const resetConcept = useCallback(
    async updatedConcept => {
      setEditing(false)

      const { pendingHistory } = await refreshPanelData('pendingHistory')
      const pendingConcept = pendingHistory.filter(
        history => history.concept === updatedConcept.name
      )

      const conceptState = initialConceptState(updatedConcept, pendingConcept)
      setInitialState(conceptState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: conceptState })
    },
    [refreshPanelData]
  )

  const handleSetConcept = useCallback(
    selectedConcept => {
      resetConcept(selectedConcept).then(() => {
        setConcept(selectedConcept)
        setEditing(false)
      })
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

    if (isConceptPanelActive && dirtyConcept) {
      setDirtyConcept(false)
      if (selectedConcept) {
        // Force reload the selected concept from server to sync taxonomy/state
        loadConcept(selectedConcept, true).then(refreshed => {
          if (refreshed) {
            resetConcept(refreshed)
          }
        })
        return
      }
      // If different concept is selected, fall through to normal loader path
    }
    if (shouldUpdateConcept) {
      if (hasUnsavedChanges) {
        displayStaged(CONTINUE)
        setModalData(prev => ({ ...prev, concept: selectedConcept }))
      } else {
        setHasUnsavedChanges(false)
        conceptLoader(selectedConcept)
      }
    }
  }, [
    concept,
    conceptLoader,
    dirtyConcept,
    setDirtyConcept,
    displayStaged,
    getSelected,
    hasUnsavedChanges,
    panels,
    setHasUnsavedChanges,
    setModalData,
    resetConcept,
  ])

  useEffect(() => {
    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    if (isConceptPanelActive && initialState) {
      const hasModifications = isStateModified({ initialState, stagedState })
      setHasUnsavedChanges(hasModifications)
    } else {
      setHasUnsavedChanges(false)
    }
  }, [initialState, stagedState, panels, setHasUnsavedChanges])

  const value = useMemo(
    () => ({
      concept,
      conceptPath,
      confirmReset,
      editing,
      initialState,
      modifyConcept,
      pending,
      resetConcept,
      setEditing,
      setPendingConfirm,
      stagedState,
    }),
    [
      concept,
      conceptPath,
      confirmReset,
      editing,
      initialState,
      modifyConcept,
      pending,
      resetConcept,
      setEditing,
      setPendingConfirm,
      stagedState,
    ]
  )

  return <ConceptContext value={value}>{children}</ConceptContext>
}

export default ConceptProvider
