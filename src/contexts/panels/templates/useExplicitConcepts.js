import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getTemplates, getTemplatesCount } from '@/lib/api/linkTemplates'
import { PAGINATION } from '@/lib/constants'

const EXPORT_PAGE_SIZE = PAGINATION.TEMPLATES.EXPORT_PAGE_SIZE

const useExplicitConcepts = () => {
  const { apiFns } = use(ConfigContext)

  // Concepts with explicit Templates defined
  const loadExplicitConcepts = useCallback(async () => {
    if (!apiFns) return []

    const totalCount = await apiFns.apiResult(getTemplatesCount)
    if (!totalCount) return []

    const templatesPerPage = EXPORT_PAGE_SIZE
    const totalPages = Math.ceil(totalCount / templatesPerPage)

    const pageIndices = Array.from({ length: totalPages }, (_, i) => i)

    const uniqueConcepts = await pageIndices.reduce(async (accPromise, pageIndex) => {
      const acc = await accPromise
      const pageTemplates = await apiFns.apiPaginated(getTemplates, {
        limit: templatesPerPage,
        offset: pageIndex * templatesPerPage,
      })

      pageTemplates.forEach(t => acc.add(t.concept))
      return acc
    }, Promise.resolve(new Set()))

    return Array.from(uniqueConcepts).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  }, [apiFns])

  return loadExplicitConcepts
}

export default useExplicitConcepts
