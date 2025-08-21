import { useCallback } from 'react'

import { getHistory } from '@/lib/api/history'

const usePageData = ({
  apiFns,
  conceptData,
  count,
  selectedConcept,
  selectedType,
  sortOrder,
  typeState,
}) => {
  const pageData = useCallback(
    async ({ setTypeData }) => {
      if (!apiFns) return

      if (selectedType === 'concept' && selectedConcept) {
        const start = typeState.offset
        const end = start + typeState.limit
        setTypeData(conceptData.slice(start, end))
        return
      }

      if (selectedType === 'pending') {
        const start = typeState.offset
        const end = start + typeState.limit
        setTypeData(conceptData.slice(start, end))
        return
      }

      let actualOffset = typeState.offset
      if (sortOrder === 'desc') {
        const page = Math.floor(typeState.offset / typeState.limit)
        const totalPages = Math.ceil(count / typeState.limit)
        const reversePage = totalPages - 1 - page
        actualOffset = reversePage * typeState.limit
      }

      const data = await apiFns.apiPaginated(getHistory, [
        selectedType,
        { ...typeState, offset: actualOffset },
      ])

      const sortedData = sortOrder === 'desc' ? [...data].reverse() : data
      setTypeData(sortedData)
    },
    [apiFns, conceptData, count, selectedConcept, selectedType, sortOrder, typeState]
  )

  return pageData
}

export default usePageData
