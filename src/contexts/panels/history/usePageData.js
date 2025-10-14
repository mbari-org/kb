import { useCallback } from 'react'

import { getHistory } from '@/lib/api/history'

const usePageData = ({
  apiFns,
  conceptData,
  count,
  selectedConcept,
  selectedType,
  pageState,
}) => {
  const { limit, offset, sortOrder } = pageState

  const pageData = useCallback(
    async ({ updatePageState }) => {
      if (!apiFns) return

      if (selectedType === 'concept' && selectedConcept) {
        const start = offset
        const end = start + limit
        updatePageState({ data: conceptData.slice(start, end) })
        return
      }

      if (selectedType === 'pending') {
        const start = offset
        const end = start + limit
        updatePageState({ data: conceptData.slice(start, end) })
        return
      }

      let actualOffset = offset
      if (sortOrder === 'desc') {
        const page = Math.floor(offset / limit)
        const totalPages = Math.ceil(count / limit)
        const reversePage = totalPages - 1 - page
        actualOffset = reversePage * limit
      }

      const data = await apiFns.apiPaginated(getHistory, [
        selectedType,
        { limit, offset: actualOffset },
      ])

      const sortedData = sortOrder === 'desc' ? [...data].reverse() : data
      updatePageState({ data: sortedData })
    },
    [apiFns, conceptData, count, selectedConcept, selectedType, sortOrder, limit, offset]
  )

  return pageData
}

export default usePageData
