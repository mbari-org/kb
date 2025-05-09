import { use, useCallback, useEffect, useMemo, useReducer, useState, useRef } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import usePendingFieldDisplay from '@/contexts/concept/lib/usePendingFieldDisplay'

import useStagedStateDisplay from '@/contexts/concept/lib/edit/useStagedStateDisplay'
import useModifyConcept from '@/contexts/concept/lib/edit/useModifyConcept'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import conceptStateReducer from '@/contexts/concept/lib/edit/conceptStateReducer'

import {
  CONCEPT_STATE,
  hasModifiedState,
  initialConceptState,
} from '@/lib/kb/conceptState/conceptState'

import { LABELS } from '@/lib/constants'

const { CONTINUE } = LABELS.ACTION

const ConceptProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()
  const isLoading = useRef(false)

  const { modalData, setModal, setModalData } = use(ModalContext)
  const { selected } = use(SelectedContext)
  const { getConcept, getConceptPendingHistory, isConceptLoaded, loadConcept, taxonomy } =
    use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)
  const [editing, setEditing] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useMemo(() => itemPath(taxonomy, concept), [concept, taxonomy])

  const stagedStateDisplay = useStagedStateDisplay()
  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmAction, setEditing)
  const pendingFieldDisplay = usePendingFieldDisplay()

  const handleSetConcept = useCallback(
    selectedConcept => {
      setModal(null)

      setConcept(selectedConcept)

      const pendingHistory = getConceptPendingHistory(selectedConcept.name)
      setPendingHistory(pendingHistory)

      const initialState = initialConceptState(selectedConcept, pendingHistory)
      setInitialState(initialState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: initialState })
    },
    [getConceptPendingHistory, setModal]
  )

  useEffect(() => {
    if (!selected) {
      return
    }

    if (selected.concept !== concept?.name || selected.panel !== 'Concepts') {
      if (hasModifiedState({ initialState, stagedState })) {
        if (!modalData?.warning) {
          stagedStateDisplay(CONTINUE)
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
    stagedStateDisplay,
  ])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        confirmAction,
        editing,
        initialState,
        modifyConcept,
        pendingFieldDisplay,
        pendingHistory,
        setEditing,
        stagedState,
        stagedStateDisplay,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
