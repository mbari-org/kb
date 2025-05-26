import { use, useCallback, useEffect, useRef, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getHistory } from '@/lib/kb/api/history'

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

const useLoadHistory = type => {
  const { apiFns } = use(ConfigContext)

  const [data, setData] = useState([])

  const paginationRef = useRef({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })

  const loadHistory = useCallback(async () => {
    if (!apiFns) return

    const pageData = await apiFns.apiPagination(getHistory, [type, paginationRef.current])
    setData(pageData)
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
    loadHistory()
  }

  return {
    data,
    limit: paginationRef.current.limit,
    offset: paginationRef.current.offset,
    nextPage,
    prevPage,
    setPageSize,
  }
}

export default useLoadHistory
