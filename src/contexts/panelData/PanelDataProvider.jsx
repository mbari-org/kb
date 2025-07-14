import { use, useEffect, useState, useCallback, useMemo } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import useLoadReferences from '@/contexts/panelData/useLoadReferences'
import useLoadTemplates from '@/contexts/panelData/useLoadTemplates'
import useLoadPendingHistory from '@/contexts/panelData/useLoadPendingHistory'

export const PanelDataProvider = ({ children }) => {
  const { setProcessing } = use(AppModalContext)
  const { apiFns } = use(ConfigContext)

  const [explicitConcepts, setExplicitConcepts] = useState([])
  const [references, setReferences] = useState([])
  const [templates, setTemplates] = useState([])
  const [pendingHistory, setPendingHistory] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const loadReferences = useLoadReferences(apiFns)
  const loadTemplates = useLoadTemplates(apiFns)
  const loadPendingHistory = useLoadPendingHistory(apiFns)

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
        reference =>
          reference.id !== currentId && reference.doi?.toLowerCase() === doi.toLowerCase()
      )
    },
    [references]
  )

  const refreshData = useCallback(
    async (type = 'all') => {
      if (!apiFns) return

      setIsLoading(true)

      try {
        switch (type) {
          case 'all': {
            const [referencesData, templatesData, pendingHistoryData] = await Promise.all([
              loadReferences(),
              loadTemplates(),
              loadPendingHistory(),
            ])
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

          case 'references': {
            const referencesData = await loadReferences()
            setReferences(referencesData)
            return { references: referencesData }
          }

          case 'templates': {
            const templatesData = await loadTemplates()
            const explicitConceptsData = calcExplicitConcepts(templatesData)
            setTemplates(templatesData)
            setExplicitConcepts(explicitConceptsData)
            return { templates: templatesData, explicitConcepts: explicitConceptsData }
          }

          case 'pendingHistory': {
            const pendingHistoryData = await loadPendingHistory()
            setPendingHistory(pendingHistoryData)
            return { pendingHistory: pendingHistoryData }
          }
        }
      } finally {
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    },
    [apiFns, calcExplicitConcepts, loadReferences, loadTemplates, loadPendingHistory]
  )

  // Initial load
  useEffect(() => {
    if (apiFns) {
      refreshData()
    }
  }, [apiFns, refreshData])

  // Export processing function that wraps AppModalContext setProcessing
  const setExporting = useCallback(
    state => {
      setProcessing(state)
    },
    [setProcessing]
  )

  const value = useMemo(
    () => ({
      explicitConcepts,
      pendingHistory,
      isDoiUnique,
      isLoading,
      references,
      refreshData,
      setExporting,
      templates,
    }),
    [
      explicitConcepts,
      pendingHistory,
      isDoiUnique,
      isLoading,
      references,
      refreshData,
      setExporting,
      templates,
    ]
  )

  // Don't render children until initial data is loaded to prevent race conditions
  if (isInitialLoad) {
    return <PanelDataContext value={value}>{null}</PanelDataContext>
  }

  // After initial load, always render children (refreshes won't cause unmounting)
  return <PanelDataContext value={value}>{children}</PanelDataContext>
}

export default PanelDataProvider
