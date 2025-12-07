import { useCallback, useState } from 'react'

import { PAGINATION } from '@/lib/kb/constants/pagination.js'

const DEFAULT_LIMIT = PAGINATION.TEMPLATES.DEFAULT_LIMIT

const useTemplatePagination = () => {
  const [count, setCount] = useState(0)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const nextPage = useCallback(() => {
    setOffset(prev => prev + limit)
  }, [limit])

  const prevPage = useCallback(() => {
    setOffset(prev => Math.max(0, prev - limit))
  }, [limit])

  const setPageSize = useCallback(newLimit => {
    setLimit(newLimit)
    setOffset(0)
  }, [])

  const resetPagination = useCallback(() => {
    setOffset(0)
  }, [])

  return {
    count,
    limit,
    offset,
    nextPage,
    prevPage,
    setCount,
    setLimit,
    setOffset,
    setPageSize,
    resetPagination,
  }
}

export default useTemplatePagination
