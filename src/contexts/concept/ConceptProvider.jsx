import { use, useCallback, useEffect, useReducer, useState } from 'react'
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

import conceptState, { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { CONTINUE } = LABELS.ACTION

const ConceptProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { modal, closeModal } = use(ModalContext)
  const { selected, selectConcept, selectPanel } = use(SelectedContext)
  const { getConcept, getConceptPendingHistory, loadConcept } = use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [editing, setEditing] = useState(false)
  const [modalHasBeenDisplayed, setModalHasBeenDisplayed] = useState(false)
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

    if (!editing && selected.concept !== concept?.name) {
      loadConcept(selected.concept).then(
        loadedConcept => {
          setConcept(loadedConcept)
        },
        error => showBoundary(error)
      )
      return
    }

    // if (editing && !hasModifiedState({ initialState, stagedState })) {
    //   setEditing(false)
    //   return
    // }

    if (
      editing &&
      !modal &&
      (selected.panel !== 'Concepts' ||
        (concept && ![concept.name, ...concept.alternateNames].includes(selected.concept)))
    ) {
      if (modalHasBeenDisplayed) {
        setModalHasBeenDisplayed(false)
      } else {
        stagedStateDisplay(CONTINUE)
        setModalHasBeenDisplayed(true)
      }
      return
    }
  }, [
    concept,
    editing,
    getConcept,
    initialState,
    loadConcept,
    modal,
    modalHasBeenDisplayed,
    selectConcept,
    selectPanel,
    selected,
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
