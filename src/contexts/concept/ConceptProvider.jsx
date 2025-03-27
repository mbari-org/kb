import { use, useEffect, useReducer, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptPath from '@/contexts/concept/lib/useConceptPath'
import usePendingFieldDisplay from '@/contexts/concept/lib/usePendingFieldDisplay'

import useStagedStateDisplay from '@/contexts/concept/lib/edit/useStagedStateDisplay'
import useModifyConcept from '@/contexts/concept/lib/edit/useModifyConcept'

import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import conceptStateReducer from '@/contexts/concept/lib/edit/conceptStateReducer'

import { CONCEPT_STATE, conceptState, hasModifiedState } from '@/lib/kb/concept/state/conceptState'

import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { CONTINUE } = LABELS.ACTION

const ConceptProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { modalData, setModalData } = use(ModalContext)
  const { selected } = use(SelectedContext)
  const { getConcept, getConceptPendingHistory, loadConcept } = use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [editing, setEditing] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const conceptPath = useConceptPath(concept)
  const stagedStateDisplay = useStagedStateDisplay()
  const pendingFieldDisplay = usePendingFieldDisplay()

  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset, setEditing)

  useEffect(() => {
    if (concept) {
      const taxonomyConcept =
        concept === getConcept(concept.name) ? concept : getConcept(concept.name)

      if (!taxonomyConcept) {
        return
      }

      if (concept !== taxonomyConcept) {
        setConcept(taxonomyConcept)
      }

      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const initialState = conceptState(taxonomyConcept)
      setInitialState(initialState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: initialState })
    }
  }, [concept, getConcept, getConceptPendingHistory])

  useEffect(() => {
    if (!selected) {
      return
    }

    // When the current Concept has a name change, concept.name (the prior name) will not be in
    //  the taxonomy. In this case, set the concept to the select concept name (the new name)
    if (!!concept && selected.concept !== concept?.name && !getConcept(concept?.name)) {
      setConcept(getConcept(selected.concept))
      return
    }

    if (selected.concept !== concept?.name || selected.panel !== 'Concepts') {
      if (hasModifiedState({ initialState, stagedState })) {
        if (!modalData?.warning) {
          stagedStateDisplay(CONTINUE)
          setModalData({ warning: true })
        }
      } else {
        setEditing(false)
        loadConcept(selected.concept).then(
          loadedConcept => {
            setConcept(loadedConcept)
          },
          error => showBoundary(error)
        )
      }
      return
    }
  }, [
    concept,
    getConcept,
    initialState,
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
