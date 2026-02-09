import { use, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import useLoadConceptError from '@/lib/hooks/useLoadConceptError'
import useConceptLoader from './useConceptLoader'
import useConceptPending from './pending/useConceptPending'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'

import { getConceptPath } from '@/lib/api/concept'

import { initialConceptState, isStateModified } from '@/lib/concept/state/state'
import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { CONTINUE } = CONFIG.PANELS.CONCEPTS.MODALS.BUTTON
const { PROCESSING } = CONFIG

const ConceptProvider = ({ children }) => {
  const { beginProcessing } = use(AppModalContext)
  const isSettingConceptRef = useRef(false)
  const processingStopRef = useRef(null)
  const processingCountRef = useRef(0)
  const pendingTreeStopRef = useRef(null)
  const pendingTreeTimeoutRef = useRef(null)
  const previousConceptNameRef = useRef(null)

  const { apiFns } = use(ConfigContext)
  const { setModalData } = use(ConceptModalContext)
  const { getConceptTemplates, refreshData: refreshPanelData } = use(PanelDataContext)
  const { getSelected, panels } = use(SelectedContext)
  const { getConcept, isConceptLoaded, loadConcept, taxonomy } = use(TaxonomyContext)
  const { hasUnsavedChanges, setHasUnsavedChanges, unsafeAction } = use(UserContext)

  const [concept, setConcept] = useState(null)
  const [conceptPath, setConceptPath] = useState(null)
  const [confirmReset, setConfirmReset] = useState(null)
  const [isEditing, setEditing] = useState(false)

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const startProcessing = useCallback(
    (key, value) => {
      if (!processingStopRef.current) {
        processingStopRef.current = beginProcessing(key, value)
      }
      processingCountRef.current += 1
      return () => {
        processingCountRef.current = Math.max(0, processingCountRef.current - 1)
        if (processingCountRef.current === 0 && processingStopRef.current) {
          processingStopRef.current()
          processingStopRef.current = null
        }
      }
    },
    [beginProcessing]
  )

  const displayStaged = useDisplayStaged()
  const handleLoadConceptError = useLoadConceptError()
  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset, setEditing)

  const { pending, setPendingConfirm } = useConceptPending(concept)

  const handleSetConcept = useCallback(
    async updatedConcept => {
      if (isSettingConceptRef.current) return
      isSettingConceptRef.current = true

      setEditing(false)

      const { pendingHistory } = await refreshPanelData(PANEL_DATA.PENDING_HISTORY)
      const pendingConcept = pendingHistory.filter(
        history => history.concept === updatedConcept.name
      )

      const conceptWithTemplates = {
        ...updatedConcept,
        templates: getConceptTemplates(updatedConcept.name),
      }

      const conceptState = initialConceptState(conceptWithTemplates, pendingConcept)
      setInitialState(conceptState)
      dispatch({ type: CONCEPT_STATE.INITIAL, update: conceptState })

      setConcept(conceptWithTemplates)

      // Reset the ref on the next tick
      setTimeout(() => {
        isSettingConceptRef.current = false
      }, 0)
    },
    [getConceptTemplates, refreshPanelData]
  )

  const conceptLoader = useConceptLoader({
    getConcept,
    getSelected,
    handleLoadConceptError,
    handleSetConcept,
    isConceptLoaded,
    loadConcept,
    setEditing,
  })

  useEffect(() => {
    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    if (!isConceptPanelActive && isEditing) {
      const timeoutId = setTimeout(() => setEditing(false), 0)
      return () => clearTimeout(timeoutId)
    }
  }, [panels, isEditing])

  useEffect(() => {
    const selectedConcept = getSelected(SELECTED.CONCEPT)
    if (!selectedConcept) {
      setHasUnsavedChanges(false)
      return
    }

    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    const isNewConceptSelected = selectedConcept !== concept?.name
    const shouldUpdateConcept = isNewConceptSelected && isConceptPanelActive

    // Otherwise follow selection-change path
    if (shouldUpdateConcept) {
      if (hasUnsavedChanges) {
        displayStaged(CONTINUE)
        setModalData(prev => ({ ...prev, concept: selectedConcept }))
      } else {
        setHasUnsavedChanges(false)

        const stop = startProcessing(PROCESSING.LOAD, PROCESSING.ARG.CONCEPT)
        Promise.resolve(conceptLoader(selectedConcept)).finally(stop)
      }
    }
  }, [
    concept,
    conceptLoader,
    displayStaged,
    getConcept,
    getSelected,
    hasUnsavedChanges,
    isConceptLoaded,
    loadConcept,
    panels,
    startProcessing,
    setConcept,
    setHasUnsavedChanges,
    setModalData,
    taxonomy,
  ])

  useEffect(() => {
    const selectedConcept = getSelected(SELECTED.CONCEPT)
    if (!selectedConcept) return
    if (!isConceptLoaded(selectedConcept)) return
    if (isSettingConceptRef.current) return

    const taxonomyConcept = getConcept(selectedConcept)
    if (!taxonomyConcept) return

    const timeoutId = setTimeout(() => handleSetConcept(taxonomyConcept), 0)
    return () => clearTimeout(timeoutId)
  }, [getConcept, getSelected, handleSetConcept, isConceptLoaded, taxonomy])

  useEffect(() => {
    const isConceptPanelActive = panels.current() === SELECTED.PANELS.CONCEPTS
    if (isConceptPanelActive && initialState) {
      const hasModifications = isStateModified({ initialState, stagedState })
      setHasUnsavedChanges(hasModifications)
    } else {
      setHasUnsavedChanges(false)
    }
  }, [initialState, stagedState, panels, setHasUnsavedChanges])

  useEffect(() => {
    if (!unsafeAction) return

    displayStaged(CONTINUE)
    setModalData(prev => ({ ...prev, unsafeAction }))
  }, [unsafeAction, displayStaged, setModalData])

  // Since conceptPath is already created we can use it to determine if the concept is a marine organism
  const isMarineOrganism = useMemo(
    () => conceptPath?.includes('marine organism') ?? false,
    [conceptPath]
  )

  const onConceptTreeReady = useCallback(() => {
    if (pendingTreeStopRef.current) {
      pendingTreeStopRef.current()
      pendingTreeStopRef.current = null
    }
    if (pendingTreeTimeoutRef.current) {
      clearTimeout(pendingTreeTimeoutRef.current)
      pendingTreeTimeoutRef.current = null
    }
  }, [])

  const value = useMemo(
    () => ({
      concept,
      conceptPath,
      confirmReset,
      isEditing,
      initialState,
      isMarineOrganism,
      modifyConcept,
      onConceptTreeReady,
      pending,
      setConcept: handleSetConcept,
      setEditing,
      setPendingConfirm,
      stagedState,
    }),
    [
      concept,
      conceptPath,
      confirmReset,
      isEditing,
      handleSetConcept,
      initialState,
      isMarineOrganism,
      modifyConcept,
      onConceptTreeReady,
      pending,
      setEditing,
      setPendingConfirm,
      stagedState,
    ]
  )

  useEffect(() => {
    if (!concept || !apiFns) {
      // Reset ref when concept is cleared
      if (!concept) {
        previousConceptNameRef.current = null
      }
      return
    }

    // Only fetch concept path if the concept name has actually changed
    const currentConceptName = concept.name
    if (previousConceptNameRef.current === currentConceptName) {
      return
    }
    previousConceptNameRef.current = currentConceptName

    // Clear any prior pending tree stop/timeout
    if (pendingTreeStopRef.current) {
      pendingTreeStopRef.current()
      pendingTreeStopRef.current = null
    }
    if (pendingTreeTimeoutRef.current) {
      clearTimeout(pendingTreeTimeoutRef.current)
      pendingTreeTimeoutRef.current = null
    }

    const stop = conceptPath ? () => {} : startProcessing(PROCESSING.LOAD, PROCESSING.ARG.CONCEPT_PATH || 'concept path')

    const fetchConceptPath = async () => {
      try {
        const payload = await apiFns.apiPayload(getConceptPath, concept.name)

        const parseNode = (node, path = []) => {
          if (!node.children) return [...path, node.name]
          return parseNode(node.children[0], [...path, node.name])
        }

        setConceptPath(parseNode(payload))
        // Defer stopping until ConceptsTree signals ready (expansion/scroll done)
        pendingTreeStopRef.current = stop
        // Fallback timeout to avoid stuck overlay
        pendingTreeTimeoutRef.current = setTimeout(() => {
          if (pendingTreeStopRef.current === stop) {
            pendingTreeStopRef.current()
            pendingTreeStopRef.current = null
          }
          if (pendingTreeTimeoutRef.current) {
            clearTimeout(pendingTreeTimeoutRef.current)
            pendingTreeTimeoutRef.current = null
          }
        }, 1000)
      } catch (error) {
        stop()
        throw error
      }
    }

    fetchConceptPath()

    return () => {
      if (pendingTreeStopRef.current) {
        pendingTreeStopRef.current()
        pendingTreeStopRef.current = null
      }
      if (pendingTreeTimeoutRef.current) {
        clearTimeout(pendingTreeTimeoutRef.current)
        pendingTreeTimeoutRef.current = null
      }
    }
  }, [apiFns, concept, conceptPath, startProcessing])

  return <ConceptContext value={value}>{children}</ConceptContext>
}

export default ConceptProvider
