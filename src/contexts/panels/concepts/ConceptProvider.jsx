import { use, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useErrorBoundary } from 'react-error-boundary'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import useLoadConceptError from '@/lib/hooks/useLoadConceptError'
import useConceptLoader from './useConceptLoader'
import useConceptPending from './pending/useConceptPending'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'

import { getConceptPhylogenyUp } from '@/lib/api/concept'

import { initialConceptState, isStateModified } from '@/lib/concept/state/state'
import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/lib/config'

const { BACK_TO_EDITING } = CONFIG.BUTTON
const { PROCESSING } = CONFIG

const ConceptProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()
  const { beginProcessing } = use(AppModalContext)
  const isSettingConceptRef = useRef(false)
  const conceptSwitchStopRef = useRef(null)
  const previousConceptKeyRef = useRef(null)

  const { apiFns, phylogenyRoot } = use(ConfigContext)
  const { setModalData } = use(ConceptModalContext)
  const { ensureConceptRealizations, getConceptTemplates, pendingHistory, realizationsByConcept } =
    use(PanelDataContext)
  const pendingHistoryRef = useRef(pendingHistory)
  const { getSelected, panels, updateSelected } = use(SelectedContext)
  const { getConcept, getConceptPath, getConceptPrimaryName, isConceptLoaded, loadConcept, taxonomy } =
    use(TaxonomyContext)
  const { guardedAction, setHasUnsavedChanges } = use(UserContext)

  const [concept, setConcept] = useState(null)
  const [conceptPath, setConceptPath] = useState(null)
  const [confirmReset, setConfirmReset] = useState(null)
  const [isEditing, setEditing] = useState(false)

  const indexRef = useRef({
    aliasIndex: 0,
    mediaIndex: 0,
    realizationIndex: 0,
  })

  const [initialState, setInitialState] = useState(null)
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})

  const isConceptModified = useMemo(() => isStateModified({ initialState, stagedState }), [initialState, stagedState])

  const conceptPathsRef = useRef(new Map())

  const stopConceptSwitchProcessing = useCallback(() => {
    if (!conceptSwitchStopRef.current) return
    conceptSwitchStopRef.current()
    conceptSwitchStopRef.current = null
  }, [])

  const resetConceptPaths = useCallback(() => {
    conceptPathsRef.current.clear()
  }, [])

  const relabelConceptPaths = useCallback((oldName, newName) => {
    const relabeled = new Map()
    conceptPathsRef.current.forEach((path, key) => {
      relabeled.set(
        key === oldName ? newName : key,
        path.map(name => (name === oldName ? newName : name))
      )
    })
    conceptPathsRef.current = relabeled
  }, [])

  // Idempotent: do not stop/restart if already showing — that flashes the overlay off.
  const startConceptSwitchProcessing = useCallback(() => {
    if (conceptSwitchStopRef.current) return
    conceptSwitchStopRef.current = beginProcessing(PROCESSING.LOAD, PROCESSING.ARG.CONCEPT, {
      delayMs: 0,
      timeoutMs: 60000,
    })
  }, [beginProcessing])

  // Click handlers: commit overlay NOW so the browser can paint before heavy tree work.
  const prepareConceptSwitch = useCallback(() => {
    if (conceptSwitchStopRef.current) return
    flushSync(() => {
      startConceptSwitchProcessing()
    })
  }, [startConceptSwitchProcessing])

  const displayStaged = useDisplayStaged()
  const handleLoadConceptError = useLoadConceptError()
  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset, setEditing)

  const { pending, setPendingConfirm } = useConceptPending(concept)

  useEffect(() => {
    pendingHistoryRef.current = pendingHistory
  }, [pendingHistory])

  useEffect(() => {
    indexRef.current = {
      aliasIndex: stagedState?.aliasIndex ?? 0,
      mediaIndex: stagedState?.mediaIndex ?? 0,
      realizationIndex: stagedState?.realizationIndex ?? 0,
    }
  }, [stagedState?.aliasIndex, stagedState?.mediaIndex, stagedState?.realizationIndex])

  const handleSetConcept = useCallback(
    async (updatedConcept, pendingHistoryOverride) => {
      if (isSettingConceptRef.current) return
      isSettingConceptRef.current = true

      try {
        const isSameConcept = concept?.name && concept?.name === updatedConcept.name
        if (!isSameConcept) {
          setEditing(false)
        }

        if (pendingHistoryOverride) {
          pendingHistoryRef.current = pendingHistoryOverride
        }

        const pendingConcept = pendingHistoryRef.current.filter(history => history.concept === updatedConcept.name)

        const realizations = await ensureConceptRealizations(updatedConcept.name)

        const conceptWithTemplates = {
          ...updatedConcept,
          realizations,
          templates: getConceptTemplates(updatedConcept.name),
        }

        const initialState = initialConceptState(conceptWithTemplates, pendingConcept)

        if (isSameConcept) {
          const clampIndex = (index, length) => {
            if (!Number.isFinite(index)) return 0
            if (!Number.isFinite(length) || length <= 0) return 0
            return Math.max(0, Math.min(index, length - 1))
          }

          initialState.aliasIndex = clampIndex(indexRef.current.aliasIndex, initialState.aliases?.length)
          initialState.mediaIndex = clampIndex(indexRef.current.mediaIndex, initialState.media?.length)
          initialState.realizationIndex = clampIndex(
            indexRef.current.realizationIndex,
            initialState.realizations?.length
          )
        }

        const stagedState = structuredClone(initialState)

        setInitialState(initialState)
        dispatch({ type: CONCEPT_STATE.INITIAL, update: stagedState })

        setConcept(conceptWithTemplates)
      } finally {
        // Reset the ref on the next tick
        setTimeout(() => {
          isSettingConceptRef.current = false
        }, 0)
      }
    },
    [concept?.name, ensureConceptRealizations, getConceptTemplates]
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

  useLayoutEffect(() => {
    const selectedConcept = getSelected(SELECTED.CONCEPT)
    if (!selectedConcept) {
      setHasUnsavedChanges(false)
      return
    }

    const selectedPrimaryName = getConceptPrimaryName(selectedConcept)
    if (selectedPrimaryName && selectedPrimaryName !== selectedConcept) {
      updateSelected({ concept: selectedPrimaryName })
      return
    }

    if (selectedConcept !== concept?.name && panels.current() === SELECTED.PANELS.CONCEPTS) {
      if (isStateModified({ initialState, stagedState })) {
        displayStaged(BACK_TO_EDITING)
        setModalData(prev => ({ ...prev, concept: selectedConcept }))
      } else {
        setHasUnsavedChanges(false)
        startConceptSwitchProcessing()
        Promise.resolve(conceptLoader(selectedConcept)).then(
          () => {},
          () => stopConceptSwitchProcessing()
        )
      }
    }
  }, [
    concept,
    conceptLoader,
    displayStaged,
    getConcept,
    getConceptPrimaryName,
    getSelected,
    initialState,
    isConceptLoaded,
    loadConcept,
    panels,
    stagedState,
    startConceptSwitchProcessing,
    stopConceptSwitchProcessing,
    setConcept,
    setHasUnsavedChanges,
    setModalData,
    taxonomy,
    updateSelected,
  ])

  useEffect(() => {
    const selectedConcept = getSelected(SELECTED.CONCEPT)
    if (!selectedConcept) return
    if (selectedConcept !== concept?.name) return
    if (!isConceptLoaded(selectedConcept)) return
    if (isSettingConceptRef.current) return
    if (isEditing) return
    if (isConceptModified) return

    const taxonomyConcept = getConcept(selectedConcept)
    if (!taxonomyConcept) return

    const timeoutId = setTimeout(() => handleSetConcept(taxonomyConcept), 0)
    return () => clearTimeout(timeoutId)
  }, [
    concept?.name,
    getConcept,
    getSelected,
    handleSetConcept,
    initialState,
    isConceptLoaded,
    isConceptModified,
    isEditing,
    realizationsByConcept,
    taxonomy,
  ])

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
    if (!guardedAction) return

    displayStaged(BACK_TO_EDITING)
    setModalData(prev => ({ ...prev, guardedAction }))
  }, [guardedAction, displayStaged, setModalData])

  const isPhylogenyRoot = useMemo(() => conceptPath?.includes(phylogenyRoot) ?? false, [conceptPath, phylogenyRoot])

  const onConceptTreeReady = useCallback(() => {
    stopConceptSwitchProcessing()
  }, [stopConceptSwitchProcessing])

  const value = useMemo(
    () => ({
      concept,
      conceptPath,
      isEditing,
      initialState,
      isPhylogenyRoot,
      onConceptTreeReady,
      pending,
      prepareConceptSwitch,
      relabelConceptPaths,
      resetConceptPaths,
      setConcept: handleSetConcept,
      setEditing,
      setPendingConfirm,
    }),
    [
      concept,
      conceptPath,
      isEditing,
      handleSetConcept,
      initialState,
      isPhylogenyRoot,
      onConceptTreeReady,
      pending,
      prepareConceptSwitch,
      relabelConceptPaths,
      resetConceptPaths,
      setEditing,
      setPendingConfirm,
    ]
  )

  const stagedValue = useMemo(
    () => ({
      confirmReset,
      modifyConcept,
      stagedState,
    }),
    [confirmReset, modifyConcept, stagedState]
  )

  useLayoutEffect(() => {
    if (!concept || !apiFns) {
      if (!concept) {
        previousConceptKeyRef.current = null
        stopConceptSwitchProcessing()
      }
      return
    }

    const conceptKey = `${concept.name}|${concept.parent}`
    if (previousConceptKeyRef.current === conceptKey) {
      return
    }

    // Record the key only once the path is applied: a re-render can cancel an in-flight fetch,
    // and the re-run must be free to start another one.
    const applyPath = path => {
      previousConceptKeyRef.current = conceptKey
      conceptPathsRef.current.set(concept.name, path)
      setConceptPath(path)
      stopConceptSwitchProcessing()
    }

    const cachedPath = conceptPathsRef.current.get(concept.name)
    if (cachedPath) {
      applyPath(cachedPath)
      return
    }

    const taxonomyPath = getConceptPath(concept.name)
    if (taxonomyPath) {
      applyPath(taxonomyPath)
      return
    }

    startConceptSwitchProcessing()
    let cancelled = false

    const resolveConceptPath = async () => {
      try {
        const payload = await apiFns.apiPayload(getConceptPhylogenyUp, concept.name)
        if (cancelled) return

        const parseNode = (node, path = []) => {
          if (!node.children) return [...path, node.name]
          return parseNode(node.children[0], [...path, node.name])
        }

        applyPath(parseNode(payload))
      } catch (error) {
        if (!cancelled) stopConceptSwitchProcessing()
        throw error
      }
    }

    resolveConceptPath().catch(showBoundary)

    return () => {
      cancelled = true
    }
  }, [apiFns, concept, getConceptPath, showBoundary, startConceptSwitchProcessing, stopConceptSwitchProcessing])

  return (
    <ConceptContext value={value}>
      <ConceptStagedContext value={stagedValue}>{children}</ConceptStagedContext>
    </ConceptContext>
  )
}

export default ConceptProvider
