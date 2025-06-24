import { use, useEffect, useState, useCallback } from 'react'

import { getReferences as getReferencesApi } from '@/lib/api/references'
import { getTemplates, getTemplatesCount } from '@/lib/api/linkTemplates'

import ConfigContext from '@/contexts/config/ConfigContext'
import KBDataContext from '@/contexts/KBDataContext'

import { createReference } from '@/lib/kb/model/reference'

import { PAGINATION } from '@/lib/constants'

const { REFERENCES, TEMPLATES } = PAGINATION

export const KBDataProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [references, setReferences] = useState([])
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  const loadTemplates = useCallback(async () => {
    const EXPORT_PAGE_SIZE = TEMPLATES.EXPORT_PAGE_SIZE

    const totalCount = await apiFns.apiResult(getTemplatesCount)
    if (!totalCount) return []

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

    return allTemplates
  }, [apiFns])

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

  const refreshData = useCallback(async () => {
    if (!apiFns) return

    setIsLoading(true)

    try {
      const [referencesData, templatesData] = await Promise.all([loadReferences(), loadTemplates()])

      setReferences(referencesData)
      setTemplates(templatesData)
    } catch (error) {
      console.error('Error refreshing KB data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [apiFns, loadReferences, loadTemplates])

  // Initial load
  useEffect(() => {
    refreshData()
  }, [refreshData])

  const value = {
    references,
    templates,
    isLoading,
    refreshData,
    isDoiUnique,
  }

  return <KBDataContext.Provider value={value}>{children}</KBDataContext.Provider>
}

export default KBDataProvider
