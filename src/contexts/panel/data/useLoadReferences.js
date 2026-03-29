import { useCallback } from 'react'

import { getReferences as getReferencesApi } from '@/lib/api/references'

import { PAGINATION } from '@/lib/constants/pagination.js'
import { createError } from '@/lib/errors'
import { createReference } from '@/lib/model/reference'

const { REFERENCES } = PAGINATION
const { EXPORT_PAGE_SIZE, MAX_PAGES } = REFERENCES

/**
 * Hook for loading references data
 * @param {Object} apiFns - API functions from ConfigContext
 * @returns {Function} loadReferences function
 */
const useLoadReferences = apiFns => {
  const loadReferences = useCallback(async () => {
    let allReferences = []
    let pageIndex = 0
    let hasMoreData = true
    const seenPageSignatures = new Set()

    while (hasMoreData) {
      if (pageIndex >= MAX_PAGES) {
        throw createError(
          'Invalid References Pagination',
          `Reference pagination exceeded ${MAX_PAGES} pages without completion`,
          { maxPages: MAX_PAGES, pageSize: EXPORT_PAGE_SIZE }
        )
      }
      const referenceData = await apiFns.apiPaginated(getReferencesApi, {
        limit: EXPORT_PAGE_SIZE,
        offset: pageIndex * EXPORT_PAGE_SIZE,
      })

      if (!referenceData || referenceData.length === 0) {
        hasMoreData = false
        continue
      }
      const pageSignature = referenceData
        .map(reference => reference.id ?? JSON.stringify(reference))
        .join('|')
      if (seenPageSignatures.has(pageSignature)) {
        throw createError(
          'Invalid References Pagination',
          'Reference pagination repeated a previous page and would not terminate',
          { pageIndex, pageSize: EXPORT_PAGE_SIZE }
        )
      }
      seenPageSignatures.add(pageSignature)

      allReferences.push(...referenceData)
      if (referenceData.length < EXPORT_PAGE_SIZE) {
        hasMoreData = false
      }
      pageIndex++
    }

    return allReferences.map(reference => createReference(reference))
  }, [apiFns])

  return loadReferences
}

export default useLoadReferences
