import { useCallback } from 'react'

import { getReferences as getReferencesApi } from '@/lib/kb/api/references'

import { PAGINATION } from '@/constants/pagination.js'
import { createReference } from '@/lib/kb/model/reference'

const { REFERENCES } = PAGINATION

/**
 * Hook for loading references data
 * @param {Object} apiFns - API functions from ConfigContext
 * @returns {Function} loadReferences function
 */
const useLoadReferences = apiFns => {
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

  return loadReferences
}

export default useLoadReferences
