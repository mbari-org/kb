import { use, useCallback, useEffect, useReducer, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
// import { useTheme } from "@mui/material/styles"

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptModified from '@/contexts/concept/lib/useConceptModified'
import useConceptPath from '@/contexts/concept/lib/useConceptPath'
import usePendingFieldDisplay from '@/contexts/concept/lib/usePendingFieldDisplay'

import useStagedStateDisplay from '@/contexts/concept/lib/edit/useStagedStateDisplay'
import useModifyConcept from '@/contexts/concept/lib/edit/useModifyConcept'

import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import conceptState from '@/lib/kb/concept/state/conceptState'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import { INTENT } from '@/contexts/concept/lib/edit/useStagedStateDisplay'

import { conceptStateReducer } from '@/contexts/concept/lib/edit/conceptStateReducer'

const ConceptProvider = ({ children }) => {
  // const theme = useTheme()

  const { showBoundary } = useErrorBoundary()

  const { modal, closeModal } = use(ModalContext)
  const { selected, selectConcept, selectPanel } = use(SelectedContext)
  const {
    // filterRanks,
    getConcept,
    getConceptPendingHistory,
    loadConcept,
    // updateConcept,
    // updateConceptName,
  } = use(TaxonomyContext)

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

  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset)

  const { getConceptUpdates, isModified } = useConceptModified({
    editing,
    initialState,
    stagedState,
  })

  // CxTBD Is this needed?
  const resetConcept = useCallback(
    toState => {
      setEditing(false)
      closeModal()

      const resetConceptConcept = { ...concept, ...toState }
      setConcept(resetConceptConcept)

      dispatch({ type: CONCEPT_STATE.INITIAL, update: toState })
    },
    [concept, closeModal]
  )

  const submitUpdates = () => {
    const conceptUpdates = getConceptUpdates()
    console.log('CxConceptProvider: conceptUpdates', conceptUpdates)
    // update({
    //   concept,
    //   config: taxonomy.config,
    //   updates: stagedState,
    // })
  }

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

    if (editing && (selected.panel !== 'Concepts' || selected.concept !== concept?.name)) {
      if (!isModified()) {
        setEditing(false)
        return
      }

      if (!modal) {
        if (modalHasBeenDisplayed) {
          setModalHasBeenDisplayed(false)
        } else {
          stagedStateDisplay(INTENT.CONTINUE)
          setModalHasBeenDisplayed(true)
        }
        return
      }
    }
  }, [
    concept,
    editing,
    getConcept,
    isModified,
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

  useEffect(() => {
    if (concept) {
      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const initialState = conceptState(concept)
      setInitialState(initialState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: initialState })
    }
  }, [concept, getConceptPendingHistory])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        confirmReset,
        editing,
        initialState,
        isModified,
        modifyConcept,
        pendingFieldDisplay,
        pendingHistory,
        resetConcept,
        setEditing,
        stagedState,
        stagedStateDisplay,
        submitUpdates,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
