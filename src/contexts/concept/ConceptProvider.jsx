import { use, useEffect, useMemo, useReducer, useState, useRef } from 'react'
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

  const { modalData, setModalData } = use(ModalContext)
  const { selected } = use(SelectedContext)
  const { getConcept, getConceptPendingHistory, isConceptLoaded, loadConcept, taxonomy } =
    use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [editing, setEditing] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useMemo(() => itemPath(taxonomy, concept), [concept, taxonomy])

  const stagedStateDisplay = useStagedStateDisplay()
  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset, setEditing)
  const pendingFieldDisplay = usePendingFieldDisplay()

  useEffect(() => {
    const taxonomyConcept = getConcept(selected.concept)
    if (!taxonomyConcept) {
      return
    }

    if (concept) {
      if (concept !== taxonomyConcept) {
        setConcept(taxonomyConcept)
      }

      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const initialState = initialConceptState(taxonomyConcept, pendingHistory)
      setInitialState(initialState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: initialState })
    }
  }, [concept, getConcept, getConceptPendingHistory, selected.concept, setConcept])

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
          setConcept(getConcept(selected.concept))
        } else if (!isLoading.current) {
          isLoading.current = true
          setEditing(false)
          loadConcept(selected.concept)
            .then(loadedConcept => {
              setConcept(loadedConcept)
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
    initialState,
    isConceptLoaded,
    loadConcept,
    modalData,
    selected,
    setConcept,
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
        confirmReset,
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
