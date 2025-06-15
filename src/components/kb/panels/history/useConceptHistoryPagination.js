import { PAGINATION } from '@/lib/constants'
import { useState } from 'react'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT

const useConceptHistoryPagination = count => {
  const [pageState, setPageState] = useState({ limit: DEFAULT_LIMIT, offset: 0 })
  const [sortOrder, setSortOrder] = useState('desc')

  const nextPage = () => {
    setPageState(prev => ({
      ...prev,
      offset: Math.min(prev.offset + prev.limit, count - prev.limit),
    }))
  }

  const prevPage = () => {
    setPageState(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }))
  }

  const setPageSize = newLimit => {
    setPageState(_prev => ({
      limit: newLimit,
      offset: 0,
    }))
  }

  const handleSortChange = newSortOrder => {
    setSortOrder(newSortOrder)
    // Reset to first page when sort order changes
    setPageState(prev => ({ ...prev, offset: 0 }))
  }

  const resetPagination = () => {
    setPageState({ limit: DEFAULT_LIMIT, offset: 0 })
  }

  return {
    pageState,
    sortOrder,
    nextPage,
    prevPage,
    setPageSize,
    handleSortChange,
    resetPagination,
  }
}

export default useConceptHistoryPagination
