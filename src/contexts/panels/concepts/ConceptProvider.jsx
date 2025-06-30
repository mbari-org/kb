import { use, useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import useStagedModal from '@/components/kb/panels/concepts/concept/change/staged/modal/useStagedModal'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import useLoadConceptError from '@/hooks/useLoadConceptError'
import useConceptLoader from './useConceptLoader'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'

import { hasModifiedState, initialConceptState } from '@/lib/kb/state/concept'

import { CONCEPT_STATE, LABELS, SELECTED } from '@/lib/constants'

const { CONTINUE } = LABELS.BUTTON

const ConceptProvider = ({ children }) => {
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getSelected, panels } = use(SelectedContext)
  const { getConcept, getPendingHistory, isConceptLoaded, loadConcept, taxonomy } =
    use(TaxonomyContext)

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
    refreshedConcept => {
      const conceptToRefresh = refreshedConcept || concept

      const conceptPending = getPendingHistory(conceptToRefresh.name)

      const refreshedInitialState = initialConceptState(conceptToRefresh, conceptPending)
      setInitialState(refreshedInitialState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: refreshedInitialState })
    },
    [concept, getPendingHistory]
  )

  const handleSetConcept = useCallback(
    selectedConcept => {
      setConcept(selectedConcept)
      setEditing(false)
      refreshConcept(selectedConcept)
    },
    [refreshConcept]
  )

  const conceptLoader = useConceptLoader({
    isConceptLoaded,
    getConcept,
    loadConcept,
    handleSetConcept,
    handleLoadConceptError,
    getSelected,
    setEditing,
  })

  useEffect(() => {
    const selectedConcept = getSelected(SELECTED.CONCEPT)
    if (!selectedConcept) {
      return
    }

    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    const isNewConceptSelected = selectedConcept !== concept?.name
    const shouldUpdateConcept = isNewConceptSelected && isConceptPanelActive

    if (shouldUpdateConcept) {
      const hasUnsavedChanges = hasModifiedState({ initialState, stagedState })

      if (hasUnsavedChanges) {
        if (!modalData?.warning) {
          displayStaged(CONTINUE)
          setModalData(prev => ({ ...prev, warning: true }))
        }
      } else {
        conceptLoader(selectedConcept)
      }
    }
  }, [
    concept,
    displayStaged,
    getSelected,
    initialState,
    conceptLoader,
    modalData?.warning,
    panels,
    setModalData,
    stagedState,
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
