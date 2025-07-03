import { use, useEffect, useState, useCallback, useMemo } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import useLoadReferences from '@/contexts/panelData/useLoadReferences'
import useLoadTemplates from '@/contexts/panelData/useLoadTemplates'
import useLoadHistory from '@/contexts/panelData/useLoadHistory'

export const PanelDataProvider = ({ children }) => {
  const { setProcessing } = use(AppModalContext)
  const { apiFns } = use(ConfigContext)

  const [explicitConcepts, setExplicitConcepts] = useState([])
  const [references, setReferences] = useState([])
  const [templates, setTemplates] = useState([])
  const [history, setHistory] = useState({ approved: [], pending: [] })

  const [isLoading, setIsLoading] = useState(true)

  const loadReferences = useLoadReferences(apiFns)
  const loadTemplates = useLoadTemplates(apiFns)
  const loadHistory = useLoadHistory(apiFns)

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
            const [referencesData, templatesData, historyData] = await Promise.all([
              loadReferences(),
              loadTemplates(),
              loadHistory(),
            ])

            setReferences(referencesData)
            setTemplates(templatesData)
            setHistory(historyData)
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
            const historyData = await loadHistory()
            setHistory(historyData)
            break
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [apiFns, calcExplicitConcepts, loadReferences, loadTemplates, loadHistory]
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
      history,
      isDoiUnique,
      isLoading,
      references,
      refreshData,
      setExporting,
      templates,
    }),
    [
      references,
      templates,
      history,
      explicitConcepts,
      isLoading,
      refreshData,
      isDoiUnique,
      setExporting,
    ]
  )

  return <PanelDataContext value={value}>{children}</PanelDataContext>
}

export default PanelDataProvider
