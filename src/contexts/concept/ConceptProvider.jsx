import { use, useCallback, useEffect, useMemo, useReducer, useState, useRef } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import useDisplayStaged from '@/components/kb/panels/concepts/change/staged/modal/useDisplayStaged'
import useModifyConcept from '@/contexts/concept/staged/edit/useModifyConcept'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import conceptStateReducer from '@/contexts/concept/staged/edit/conceptStateReducer'

import { hasModifiedState, initialConceptState } from '@/lib/kb/state/concept'

import { CONCEPT_STATE, LABELS } from '@/lib/constants'

const { CONTINUE } = LABELS.BUTTON

const ConceptProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()
  const isLoading = useRef(false)
  const previousConceptName = useRef(null)

  const { modalData, setModalData } = use(ModalContext)
  const { getSelected, panels } = use(SelectedContext)
  const { getConcept, getPendingHistory, getRoot, isConceptLoaded, loadConcept, taxonomy } =
    use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [confirmReset, setConfirmReset] = useState(null)
  const [confirmPending, setConfirmPending] = useState(null)
  const [editing, setEditing] = useState(false)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useMemo(() => itemPath(taxonomy, concept), [concept, taxonomy])

  const displayStaged = useDisplayStaged()
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
    const selectedConcept = getSelected('concept')
    if (!selectedConcept) {
      return
    }

    const shouldUpdateConcept =
      selectedConcept !== previousConceptName.current && panels.current() === 'Concepts'

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
            .catch(error => showBoundary(error))
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
    handleSetConcept,
    initialState,
    isConceptLoaded,
    loadConcept,
    modalData?.warning,
    panels,
    setEditing,
    setModalData,
    showBoundary,
    stagedState,
  ])

  return (
    <ConceptContext
      value={{
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
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
