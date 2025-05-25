import { use, useCallback, useEffect, useRef, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { fetchHistory } from '@/lib/kb/api/history'

const DEFAULT_LIMIT = 100
const DEFAULT_OFFSET = 0

const useLoadHistory = type => {
  const { apiFns } = use(ConfigContext)
  const [history, setHistory] = useState([])
  const paginationRef = useRef({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })

  const loadHistory = useCallback(async () => {
    if (!apiFns) return
    const {
      result,
      limit: newLimit,
      offset: newOffset,
    } = await apiFns.apiPagination(fetchHistory, type, paginationRef.current)
    setHistory(result)
    paginationRef.current = { limit: newLimit, offset: newOffset }
  }, [apiFns, type])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

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
    paginationRef.current.offset = 0
    loadHistory()
  }

  return {
    history,
    limit: paginationRef.current.limit,
    offset: paginationRef.current.offset,
    nextPage,
    prevPage,
    setPageSize,
  }
}

export default useLoadHistory
