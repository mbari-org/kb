import { use, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import useLoadReferences from '@/contexts/panel/data/useLoadReferences'
import useLoadRealizations from '@/contexts/panel/data/useLoadRealizations'
import useLoadTemplates from '@/contexts/panel/data/useLoadTemplates'
import useLoadPendingHistory from '@/contexts/panel/data/useLoadPendingHistory'
import { LOADING } from '@/lib/constants/loading.js'

import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { createError } from '@/lib/errors'

import { sortRealizations } from '@/lib/model/realization'
import { withTimeout } from '@/lib/utils'

const ALL_REALIZATIONS_KEY = '__all__'

export const PanelDataProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()
  const { apiFns } = use(ConfigContext)

  const [explicitConcepts, setExplicitConcepts] = useState([])
  const [references, setReferences] = useState([])
  const [templates, setTemplates] = useState([])
  const [pendingHistory, setPendingHistory] = useState([])

  const [realizationsByConcept, setRealizationsByConcept] = useState({})
  const realizationsByConceptRef = useRef({})
  const [realizationsAllLoaded, setRealizationsAllLoaded] = useState(false)
  const realizationsAllLoadedRef = useRef(false)
  const realizationLoadsRef = useRef(new Map())

  const commitRealizationsByConcept = useCallback(next => {
    realizationsByConceptRef.current = next
    setRealizationsByConcept(next)
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [clearTemplateFilters, setClearTemplateFilters] = useState(false)

  const loadReferences = useLoadReferences(apiFns)
  const loadRealizations = useLoadRealizations(apiFns)
  const loadTemplates = useLoadTemplates(apiFns)
  const loadPendingHistory = useLoadPendingHistory(apiFns)

  const withLoadTimeout = useCallback(promise => {
    return withTimeout(
      promise,
      LOADING.STARTUP.PANEL_DATA_TIMEOUT,
      createError(
        'Panel Data Load Timeout',
        `Panel data did not finish loading within ${LOADING.STARTUP.PANEL_DATA_TIMEOUT}ms`,
        { timeoutMs: LOADING.STARTUP.PANEL_DATA_TIMEOUT }
      )
    )
  }, [])

  const calcExplicitConcepts = useCallback(templatesData => {
    if (!templatesData || templatesData.length === 0) return []
    const uniqueConcepts = new Set()
    templatesData.forEach(template => uniqueConcepts.add(template.concept))
    return Array.from(uniqueConcepts).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  }, [])

  const isDoiUnique = useCallback(
    (doi, currentId) => {
      if (!doi) return true
      return !references.some(
        reference => reference.id !== currentId && reference.doi?.toLowerCase() === doi.toLowerCase()
      )
    },
    [references]
  )

  const getConceptTemplates = useCallback(
    conceptName => {
      return conceptName ? templates.filter(template => template.concept === conceptName) : templates
    },
    [templates]
  )

  const getReferences = useCallback(
    conceptName => {
      return conceptName ? references.filter(reference => reference.concepts.includes(conceptName)) : references
    },
    [references]
  )

  const getConceptRealizations = useCallback(conceptName => realizationsByConcept[conceptName], [realizationsByConcept])

  const getAllRealizations = useCallback(() => Object.values(realizationsByConcept).flat(), [realizationsByConcept])

  const setConceptRealizations = useCallback(
    (conceptName, realizations) => {
      const sorted = sortRealizations([...realizations])
      commitRealizationsByConcept({ ...realizationsByConceptRef.current, [conceptName]: sorted })
      return sorted
    },
    [commitRealizationsByConcept]
  )

  const invalidateConceptRealizations = useCallback(
    conceptName => {
      if (conceptName === 'all') {
        realizationLoadsRef.current.clear()
        realizationsAllLoadedRef.current = false
        setRealizationsAllLoaded(false)
        commitRealizationsByConcept({})
        return
      }
      const next = { ...realizationsByConceptRef.current }
      delete next[conceptName]
      commitRealizationsByConcept(next)
    },
    [commitRealizationsByConcept]
  )

  const reloadConceptRealizations = useCallback(
    async conceptName => {
      const realizations = await loadRealizations(conceptName)
      return setConceptRealizations(conceptName, realizations)
    },
    [loadRealizations, setConceptRealizations]
  )

  const renameRealizationToConceptNames = useCallback(
    (oldName, newName) => {
      commitRealizationsByConcept(
        Object.fromEntries(
          Object.entries(realizationsByConceptRef.current).map(([conceptName, realizations]) => [
            conceptName,
            realizations.map(realization =>
              realization.toConcept === oldName ? { ...realization, toConcept: newName } : realization
            ),
          ])
        )
      )
    },
    [commitRealizationsByConcept]
  )

  const renameConceptRealizations = useCallback(
    (oldName, newName) => {
      const realizations = realizationsByConceptRef.current[oldName]
      if (realizations === undefined) return

      const next = { ...realizationsByConceptRef.current }
      delete next[oldName]
      next[newName] = realizations.map(realization => ({ ...realization, concept: newName }))
      commitRealizationsByConcept(next)
    },
    [commitRealizationsByConcept]
  )

  const ensureConceptRealizations = useCallback(
    conceptName => {
      const loaded = realizationsByConceptRef.current[conceptName]
      if (loaded !== undefined) return Promise.resolve(loaded)
      if (realizationsAllLoadedRef.current) return Promise.resolve([])

      const pending = realizationLoadsRef.current.get(conceptName)
      if (pending) return pending

      const load = reloadConceptRealizations(conceptName).finally(() => realizationLoadsRef.current.delete(conceptName))
      realizationLoadsRef.current.set(conceptName, load)
      return load
    },
    [reloadConceptRealizations]
  )

  const loadAllRealizations = useCallback(
    ({ force = false } = {}) => {
      if (realizationsAllLoadedRef.current && !force) {
        return Promise.resolve(Object.values(realizationsByConceptRef.current).flat())
      }

      const pending = realizationLoadsRef.current.get(ALL_REALIZATIONS_KEY)
      if (pending && !force) return pending

      const load = (async () => {
        try {
          const allRealizations = await loadRealizations()
          const grouped = {}
          allRealizations.forEach(realization => {
            if (!realization.concept) return
            grouped[realization.concept] ||= []
            if (!grouped[realization.concept].some(({ id }) => id === realization.id)) {
              grouped[realization.concept].push(realization)
            }
          })
          Object.values(grouped).forEach(sortRealizations)
          realizationsAllLoadedRef.current = true
          setRealizationsAllLoaded(true)
          commitRealizationsByConcept(grouped)
          return Object.values(grouped).flat()
        } finally {
          realizationLoadsRef.current.delete(ALL_REALIZATIONS_KEY)
        }
      })()
      realizationLoadsRef.current.set(ALL_REALIZATIONS_KEY, load)
      return load
    },
    [commitRealizationsByConcept, loadRealizations]
  )

  const refreshData = useCallback(
    async (type = 'all') => {
      if (!apiFns) return

      setIsLoading(true)

      try {
        switch (type) {
          case 'startup': {
            const [referencesData, templatesData, pendingHistoryData] = await withLoadTimeout(
              Promise.all([loadReferences(), loadTemplates(), loadPendingHistory()])
            )
            const explicitConceptsData = calcExplicitConcepts(templatesData)

            setReferences(referencesData)
            setTemplates(templatesData)
            setPendingHistory(pendingHistoryData)
            setExplicitConcepts(explicitConceptsData)

            return {
              references: referencesData,
              templates: templatesData,
              pendingHistory: pendingHistoryData,
              explicitConcepts: explicitConceptsData,
            }
          }
          case 'all': {
            const [referencesData, realizationsData, templatesData, pendingHistoryData] = await withLoadTimeout(
              Promise.all([
                loadReferences(),
                loadAllRealizations({ force: true }),
                loadTemplates(),
                loadPendingHistory(),
              ])
            )
            const explicitConceptsData = calcExplicitConcepts(templatesData)

            setReferences(referencesData)
            setTemplates(templatesData)
            setPendingHistory(pendingHistoryData)
            setExplicitConcepts(explicitConceptsData)

            return {
              references: referencesData,
              realizations: realizationsData,
              templates: templatesData,
              pendingHistory: pendingHistoryData,
              explicitConcepts: explicitConceptsData,
            }
          }
          case PANEL_DATA.REALIZATIONS: {
            const realizationsData = await withLoadTimeout(loadAllRealizations({ force: true }))
            return { realizations: realizationsData }
          }

          case PANEL_DATA.REFERENCES: {
            const referencesData = await withLoadTimeout(loadReferences())
            setReferences(referencesData)
            return { references: referencesData }
          }

          case PANEL_DATA.TEMPLATES: {
            const templatesData = await withLoadTimeout(loadTemplates())
            const explicitConceptsData = calcExplicitConcepts(templatesData)
            setTemplates(templatesData)
            setExplicitConcepts(explicitConceptsData)
            return { templates: templatesData, explicitConcepts: explicitConceptsData }
          }

          case PANEL_DATA.PENDING_HISTORY: {
            const pendingHistoryData = await withLoadTimeout(loadPendingHistory())
            setPendingHistory(pendingHistoryData)
            return { pendingHistory: pendingHistoryData }
          }
        }
      } finally {
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    },
    [
      apiFns,
      calcExplicitConcepts,
      loadAllRealizations,
      loadPendingHistory,
      loadReferences,
      loadTemplates,
      withLoadTimeout,
    ]
  )

  useEffect(() => {
    if (!apiFns) return
    const timeoutId = globalThis.setTimeout(() => {
      refreshData('startup').catch(showBoundary)
    }, 0)
    return () => globalThis.clearTimeout(timeoutId)
  }, [apiFns, refreshData, showBoundary])

  const value = useMemo(
    () => ({
      clearTemplateFilters,
      loadAllRealizations,
      ensureConceptRealizations,
      explicitConcepts,
      getAllRealizations,
      getConceptRealizations,
      getConceptTemplates,
      getReferences,
      invalidateConceptRealizations,
      isDoiUnique,
      isLoading,
      pendingHistory,
      realizationsAllLoaded,
      realizationsByConcept,
      refreshData,
      reloadConceptRealizations,
      renameConceptRealizations,
      renameRealizationToConceptNames,
      setClearTemplateFilters,
      setConceptRealizations,
      setReferences,
      templates,
    }),
    [
      clearTemplateFilters,
      loadAllRealizations,
      ensureConceptRealizations,
      explicitConcepts,
      getAllRealizations,
      getConceptRealizations,
      getConceptTemplates,
      getReferences,
      invalidateConceptRealizations,
      isDoiUnique,
      isLoading,
      pendingHistory,
      realizationsAllLoaded,
      realizationsByConcept,
      refreshData,
      reloadConceptRealizations,
      renameConceptRealizations,
      renameRealizationToConceptNames,
      setClearTemplateFilters,
      setConceptRealizations,
      setReferences,
      templates,
    ]
  )

  if (isInitialLoad) {
    return <PanelDataContext value={value}>{null}</PanelDataContext>
  }

  return <PanelDataContext value={value}>{children}</PanelDataContext>
}

export default PanelDataProvider
