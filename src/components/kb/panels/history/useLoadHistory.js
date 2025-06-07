import { use, useCallback, useEffect, useRef, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getHistory } from '@/lib/api/history'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const useLoadHistory = (type, totalCount) => {
  const { apiFns } = use(ConfigContext)

  const [data, setData] = useState([])
  const [sortOrder, setSortOrder] = useState('desc')

  const paginationRef = useRef({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })

  const loadHistory = useCallback(async () => {
    if (!apiFns || !totalCount) return

    // Calculate the actual offset based on sort order
    let actualOffset = paginationRef.current.offset
    if (sortOrder === 'asc') {
      // For ascending order, we want to start from the end
      actualOffset = Math.max(
        0,
        totalCount - paginationRef.current.limit - paginationRef.current.offset
      )
    }

    const pageData = await apiFns.apiPagination(getHistory, [
      type,
      { ...paginationRef.current, offset: actualOffset },
    ])
    setData(pageData)
  }, [apiFns, type, totalCount, sortOrder])

  // Reset pagination when type changes
  useEffect(() => {
    paginationRef.current.offset = DEFAULT_OFFSET
    loadHistory()
  }, [type, loadHistory])

  const nextPage = () => {
    paginationRef.current.offset += paginationRef.current.limit
    loadHistory()
  }

  const prevPage = () => {
    paginationRef.current.offset = Math.max(
      0,
      paginationRef.current.offset - paginationRef.current.limit
    )
    loadHistory()
  }

  const setPageSize = newLimit => {
    paginationRef.current.limit = newLimit
    loadHistory()
  }

  const handleSortChange = newSortOrder => {
    setSortOrder(newSortOrder)
    // Reset to first page when sort order changes
    paginationRef.current.offset = DEFAULT_OFFSET
    loadHistory()
  }

  return {
    data,
    limit: paginationRef.current.limit,
    offset: paginationRef.current.offset,
    nextPage,
    prevPage,
    setPageSize,
    handleSortChange,
    sortOrder,
  }
}

export default useLoadHistory
