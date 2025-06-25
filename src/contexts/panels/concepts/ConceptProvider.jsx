import { use, useCallback, useEffect, useMemo, useReducer, useState, useRef } from 'react'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import useLoadConceptError from '@/contexts/panels/concepts/useLoadConceptError'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import AppModalContext from '@/contexts/modal/AppModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'

import { hasModifiedState, initialConceptState } from '@/lib/kb/state/concept'

import { CONCEPT_STATE, LABELS, SELECTED } from '@/lib/constants'

const { CONTINUE } = LABELS.BUTTON

const ConceptProvider = ({ children }) => {
  const isLoading = useRef(false)
  const previousConceptName = useRef(null)

  const { modalData, setModalData } = use(AppModalContext)
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

  const displayStaged = useDisplayStaged()
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
      if (selectedConcept?.name !== previousConceptName.current) {
        previousConceptName.current = selectedConcept?.name
        setConcept(selectedConcept)
        setEditing(false)
        refreshConcept(selectedConcept)
      }
    },
    [refreshConcept]
  )

  useEffect(() => {
    const selectedConcept = getSelected(SELECTED.CONCEPT)
    if (!selectedConcept) {
      return
    }

    const shouldUpdateConcept =
      selectedConcept !== previousConceptName.current &&
      panels.current() === SELECTED.PANELS.CONCEPTS

    if (shouldUpdateConcept) {
      if (hasModifiedState({ initialState, stagedState })) {
        if (!modalData?.warning) {
          displayStaged(CONTINUE)
          setModalData(prev => ({ ...prev, warning: true }))
        }
      } else {
        if (isConceptLoaded(selectedConcept)) {
          handleSetConcept(getConcept(selectedConcept))
        } else if (!isLoading.current) {
          isLoading.current = true
          setEditing(false)
          loadConcept(selectedConcept)
            .then(loadedConcept => {
              handleSetConcept(loadedConcept)
            })
            .catch(error => {
              handleLoadConceptError({ ...error, conceptName: selectedConcept })
            })
            .finally(() => {
              isLoading.current = false
            })
        }
      }
    }
  }, [
    displayStaged,
    getConcept,
    getSelected,
    handleLoadConceptError,
    handleSetConcept,
    initialState,
    isConceptLoaded,
    loadConcept,
    modalData?.warning,
    panels,
    setEditing,
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
      setEditing,
      setConfirmPending,
      stagedState,
    ]
  )

  return <ConceptContext value={value}>{children}</ConceptContext>
}

export default ConceptProvider
