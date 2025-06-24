import { use, useEffect, useState, useCallback } from 'react'

import { getReferences as getReferencesApi } from '@/lib/api/references'
import { getTemplates, getTemplatesCount } from '@/lib/api/linkTemplates'

import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import KBDataContext from '@/contexts/KBDataContext'

import { createReference } from '@/lib/kb/model/reference'

import { PAGINATION } from '@/lib/constants'

const { REFERENCES, TEMPLATES } = PAGINATION

export const KBDataProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)
  const { setProcessing } = use(ModalContext)

  const [references, setReferences] = useState([])
  const [templates, setTemplates] = useState([])
  const [explicitConcepts, setExplicitConcepts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load all references
  const loadReferences = useCallback(async () => {
    const EXPORT_PAGE_SIZE = REFERENCES.EXPORT_PAGE_SIZE
    let allReferences = []
    let pageIndex = 0
    let hasMoreData = true

    while (hasMoreData) {
      const referenceData = await apiFns.apiPaginated(getReferencesApi, {
        limit: EXPORT_PAGE_SIZE,
        offset: pageIndex * EXPORT_PAGE_SIZE,
      })

      if (!referenceData || referenceData.length === 0) {
        hasMoreData = false
        continue
      }

      allReferences.push(...referenceData)
      pageIndex++
    }

    return allReferences.map(reference => createReference(reference))
  }, [apiFns])

  // Load all templates and extract explicit concepts
  const loadTemplates = useCallback(async () => {
    const EXPORT_PAGE_SIZE = TEMPLATES.EXPORT_PAGE_SIZE

    const totalCount = await apiFns.apiResult(getTemplatesCount)
    if (!totalCount) return { templates: [], explicitConcepts: [] }

    const templatesPerPage = EXPORT_PAGE_SIZE
    const totalPages = Math.ceil(totalCount / templatesPerPage)

    const pageIndices = Array.from({ length: totalPages }, (_, i) => i)

    const allTemplates = await pageIndices.reduce(async (accPromise, pageIndex) => {
      const acc = await accPromise
      const pageTemplates = await apiFns.apiPaginated(getTemplates, {
        limit: templatesPerPage,
        offset: pageIndex * templatesPerPage,
      })
      acc.push(...pageTemplates)
      return acc
    }, Promise.resolve([]))

    // Extract unique concepts that have explicit templates
    const uniqueConcepts = new Set()
    allTemplates.forEach(template => uniqueConcepts.add(template.concept))
    const explicitConceptsList = Array.from(uniqueConcepts).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    )

    return { templates: allTemplates, explicitConcepts: explicitConceptsList }
  }, [apiFns])

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!apiFns) return

    setProcessing(true)
    setIsLoading(true)

    try {
      const [referencesData, templatesData] = await Promise.all([loadReferences(), loadTemplates()])

      setReferences(referencesData)
      setTemplates(templatesData.templates)
      setExplicitConcepts(templatesData.explicitConcepts)
    } catch (error) {
      console.error('Error refreshing KB data:', error)
    } finally {
      setProcessing(false)
      setIsLoading(false)
    }
  }, [apiFns, setProcessing, loadReferences, loadTemplates])

  // Initial load
  useEffect(() => {
    refreshData()
  }, [refreshData])

  const value = {
    references,
    templates,
    explicitConcepts,
    isLoading,
    refreshData,
    // Helper functions
    getConceptReferences: concept => {
      return references.filter(reference => reference.concepts.includes(concept))
    },
    isDoiUnique: (doi, currentId) => {
      if (!doi) return true
      return !references.some(
        reference =>
          reference.id !== currentId && reference.doi?.toLowerCase() === doi.toLowerCase()
      )
    },
  }

  return <KBDataContext.Provider value={value}>{children}</KBDataContext.Provider>
}

export default KBDataProvider
