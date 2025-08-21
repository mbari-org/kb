import { useCallback } from 'react'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const usePageHistory = ({ count, setTypeState }) => {
  const nextPage = useCallback(() => {
    setTypeState(prev => ({
      ...prev,
      offset: Math.min(prev.offset + prev.limit, Math.max(0, count - prev.limit)),
    }))
  }, [count, setTypeState])

  const prevPage = useCallback(() => {
    setTypeState(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }))
  }, [setTypeState])

  const setPageSize = useCallback(
    newLimit => {
      setTypeState({ limit: newLimit, offset: 0 })
    },
    [setTypeState]
  )

  const resetPagination = useCallback(() => {
    setTypeState({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })
  }, [setTypeState])

  return { nextPage, prevPage, setPageSize, resetPagination }
}

export default usePageHistory
