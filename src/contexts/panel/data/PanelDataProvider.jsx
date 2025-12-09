import { use, useEffect, useState, useCallback, useMemo } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import useLoadReferences from '@/contexts/panel/data/useLoadReferences'
import useLoadTemplates from '@/contexts/panel/data/useLoadTemplates'
import useLoadPendingHistory from '@/contexts/panel/data/useLoadPendingHistory'

import { PANEL_DATA } from '@/lib/constants/panelData.js'

export const PanelDataProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [explicitConcepts, setExplicitConcepts] = useState([])
  const [references, setReferences] = useState([])
  const [templates, setTemplates] = useState([])
  const [pendingHistory, setPendingHistory] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [clearTemplateFilters, setClearTemplateFilters] = useState(false)

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

  const getConceptTemplates = useCallback(conceptName => {
    return conceptName
      ? templates.filter(template => template.concept === conceptName)
      : templates
  }, [templates])

  const getReferences = useCallback(conceptName => {
    return conceptName
      ? references.filter(reference => reference.concepts.includes(conceptName))
      : references
  }, [references])

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

          case PANEL_DATA.REFERENCES: {
            const referencesData = await loadReferences()
            setReferences(referencesData)
            return { references: referencesData }
          }

          case PANEL_DATA.TEMPLATES: {
            const templatesData = await loadTemplates()
            const explicitConceptsData = calcExplicitConcepts(templatesData)
            setTemplates(templatesData)
            setExplicitConcepts(explicitConceptsData)
            return { templates: templatesData, explicitConcepts: explicitConceptsData }
          }

          case PANEL_DATA.PENDING_HISTORY: {
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

  useEffect(() => {
    if (apiFns) {
      refreshData()
    }
  }, [apiFns, refreshData])

  const value = useMemo(
    () => ({
      clearTemplateFilters,
      explicitConcepts,
      getConceptTemplates,
      getReferences,
      isDoiUnique,
      isLoading,
      pendingHistory,
      refreshData,
      setClearTemplateFilters,
      setReferences,
      templates,
    }),
    [
      clearTemplateFilters,
      explicitConcepts,
      getConceptTemplates,
      getReferences,
      isDoiUnique,
      isLoading,
      pendingHistory,
      refreshData,
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
