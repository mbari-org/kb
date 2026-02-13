import { useCallback } from 'react'

import { PAGINATION } from '@/lib/constants/pagination.js'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const usePageHistory = ({ count, limit, offset, updatePageState }) => {
  const nextPage = useCallback(() => {
    const newOffset = Math.min(offset + limit, Math.max(0, count - limit))
    updatePageState({ offset: newOffset })
  }, [count, limit, offset, updatePageState])

  const prevPage = useCallback(() => {
    const newOffset = Math.max(0, offset - limit)
    updatePageState({ offset: newOffset })
  }, [limit, offset, updatePageState])

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
