import { use, useEffect, useMemo, useReducer, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { itemPath } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

import ConceptContext from '@/contexts/concept/ConceptContext'

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
  const { getConcept, getConceptPendingHistory, isConceptComplete, loadConcept, taxonomy } =
    use(TaxonomyContext)

  const [concept, setConcept] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [editing, setEditing] = useState(false)
  const [pendingHistory, setPendingHistory] = useState(null)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  // CxInc Load 'object' in fresh page, then chose 'jpg'. Looks like when conceptPath is call,
  //  'jpg' parent 'image' has not yet assigned its parent. Look at assigning concept parent on any
  //   api load in the manner that aliases are assigned.

  const conceptPath = useMemo(() => itemPath(taxonomy, concept), [concept, taxonomy])
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

    // CxInc With the reworked taxonomy/concept structure, see if this is still true. Removing
    //  the check for !getConcept(concept?.name)
    //
    // When the current Concept has a name change, concept.name (the prior name) will not be in
    //  the taxonomy. In this case, set the concept to the select concept name (the new name)
    // if (!!concept && selected.concept !== concept?.name && !getConcept(concept?.name)) {
    if (selected.concept !== concept?.name && isConceptComplete(selected.concept)) {
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
        if (isConceptComplete(selected.concept)) {
          setConcept(getConcept(selected.concept))
        } else {
          setEditing(false)
          loadConcept(selected.concept).then(
            loadedConcept => {
              setConcept(loadedConcept)
            },
            error => showBoundary(error)
          )
        }
      }
    }
  }, [
    concept,
    getConcept,
    initialState,
    isConceptComplete,
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
