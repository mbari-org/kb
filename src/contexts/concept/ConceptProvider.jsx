import { use, useCallback, useEffect, useMemo, useReducer, useState, useRef } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { itemPath } from '@/components/kb/panels/concept/tree/lib/taxonomyItem'

import useDisplayStaged from '@/components/kb/panels/concept/change/staged/modal/useDisplayStaged'
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

  const { modalData, setModal, setModalData } = use(ModalContext)
  const { selected } = use(SelectedContext)
  const { getConcept, getConceptPendingHistory, isConceptLoaded, loadConcept, taxonomy } =
    use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [confirmReset, setConfirmReset] = useState(null)
  const [confirmPending, setConfirmPending] = useState(null)
  const [editing, setEditing] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useMemo(() => itemPath(taxonomy, concept), [concept, taxonomy])

  const displayStaged = useDisplayStaged()
  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset, setEditing)

  const refreshConcept = useCallback(
    refreshedConcept => {
      setModal(null)

      const refreshedPendingHistory = getConceptPendingHistory(refreshedConcept.name)
      setPendingHistory(refreshedPendingHistory)

      const refreshedInitialState = initialConceptState(refreshedConcept, refreshedPendingHistory)
      setInitialState(refreshedInitialState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: refreshedInitialState })
    },
    [getConceptPendingHistory, setModal]
  )

  const handleSetConcept = useCallback(
    selectedConcept => {
      setConcept(selectedConcept)
      refreshConcept(selectedConcept)
    },
    [refreshConcept]
  )

  useEffect(() => {
    if (!selected) {
      return
    }

    if (selected.concept !== concept?.name || selected.panel !== 'Concepts') {
      if (hasModifiedState({ initialState, stagedState })) {
        if (!modalData?.warning) {
          displayStaged(CONTINUE)
          setModalData({ warning: true })
        }
      } else {
        if (isConceptLoaded(selected.concept)) {
          handleSetConcept(getConcept(selected.concept))
        } else if (!isLoading.current) {
          isLoading.current = true
          setEditing(false)
          loadConcept(selected.concept)
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
    concept,
    getConcept,
    handleSetConcept,
    initialState,
    isConceptLoaded,
    loadConcept,
    modalData,
    selected,
    setEditing,
    setModalData,
    showBoundary,
    stagedState,
    displayStaged,
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
        pendingHistory,
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
