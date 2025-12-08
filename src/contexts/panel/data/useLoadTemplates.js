import { useCallback } from 'react'

import { getTemplates, getTemplatesCount } from '@/lib/kb/api/templates'

import { PAGINATION } from '@/constants/pagination.js'

const { TEMPLATES } = PAGINATION

export const useLoadTemplates = apiFns => {
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

  return loadTemplates
}

export default useLoadTemplates
