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

  const [isLoading, setIsLoading] = useState(true)

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

      console.log('refresh panel data', type)

      try {
        switch (type) {
          case 'all': {
            const [referencesData, templatesData, pendingHistoryData] = await Promise.all([
              loadReferences(),
              loadTemplates(),
              loadPendingHistory(),
            ])

            setReferences(referencesData)
            setTemplates(templatesData)
            setPendingHistory(pendingHistoryData)
            setExplicitConcepts(calcExplicitConcepts(templatesData))
            break
          }

          case 'references': {
            const referencesData = await loadReferences()
            setReferences(referencesData)
            break
          }

          case 'templates': {
            const templatesData = await loadTemplates()
            setTemplates(templatesData)
            setExplicitConcepts(calcExplicitConcepts(templatesData))
            break
          }

          case 'history': {
            const pendingHistoryData = await loadPendingHistory()
            setPendingHistory(pendingHistoryData)
            break
          }
        }
      } finally {
        setIsLoading(false)
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

  return <PanelDataContext value={value}>{children}</PanelDataContext>
}

export default PanelDataProvider
