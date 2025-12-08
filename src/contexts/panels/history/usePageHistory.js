import { useCallback } from 'react'

import { PAGINATION } from '@/constants/pagination.js'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const usePageHistory = ({ count, updatePageState }) => {
  const nextPage = useCallback(() => {
    updatePageState(prev => ({
      ...prev,
      offset: Math.min(prev.offset + prev.limit, Math.max(0, count - prev.limit)),
    }))
  }, [count, updatePageState])

  const prevPage = useCallback(() => {
    updatePageState(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }))
  }, [updatePageState])

  const setPageSize = useCallback(
    newLimit => {
      updatePageState({ limit: newLimit, offset: 0 })
    },
    [updatePageState]
  )

  const resetPagination = useCallback(() => {
    updatePageState({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })
  }, [updatePageState])

  return { nextPage, prevPage, setPageSize, resetPagination }
}

export default usePageHistory
