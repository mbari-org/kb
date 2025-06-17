import { use, useCallback, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import HistoryContext from './HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { getConceptHistory, getHistory, getHistoryCount } from '@/lib/api/history'
import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const HistoryProvider = ({ children }) => {
  const { getSelected } = use(SelectedContext)
  const { apiFns } = use(ConfigContext)

  const selectedType = getSelected('history').type
  const selectedConcept = getSelected('concept')

  const [count, setCount] = useState(0)
  const [pageData, setPageData] = useState([]) // current page of pending/approved data
  const [conceptData, setConceptData] = useState([]) // full data for concept history
  const [pageState, setPageState] = useState({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })
  const [sortOrder, setSortOrder] = useState('desc')

  // Load count and data when type changes
  useEffect(() => {
    const loadCount = async () => {
      if (!apiFns) return

      if (selectedType === 'concept' && selectedConcept) {
        const data = await apiFns.apiPayload(getConceptHistory, selectedConcept)
        setCount(data.length)
        setConceptData(data) // Store full concept history data
        // Set initial page of data
        setPageData(data.slice(0, DEFAULT_LIMIT))
      } else {
        const result = await apiFns.apiResult(getHistoryCount, selectedType)
        setCount(result)
        setConceptData([]) // Clear concept data for non-concept history
      }
    }
    loadCount()
  }, [apiFns, selectedType, selectedConcept])

  // Load data when pagination or type changes
  useEffect(() => {
    const loadData = async () => {
      if (!apiFns) return

      if (selectedType === 'concept' && selectedConcept) {
        // For concept history, slice the full data we already have
        const start = pageState.offset
        const end = start + pageState.limit
        setPageData(conceptData.slice(start, end))
      } else {
        // For type history, we use the paginated endpoint
        let actualOffset = pageState.offset
        if (sortOrder === 'asc') {
          actualOffset = Math.max(0, count - pageState.limit - pageState.offset)
        }
        const data = await apiFns.apiPaginated(getHistory, [
          selectedType,
          { ...pageState, offset: actualOffset },
        ])
        setPageData(data)
      }
    }
    loadData()
  }, [apiFns, selectedType, selectedConcept, pageState, sortOrder, count, conceptData])

  const nextPage = useCallback(() => {
    setPageState(prev => ({
      ...prev,
      offset: Math.min(prev.offset + prev.limit, count - prev.limit),
    }))
  }, [count])

  const prevPage = useCallback(() => {
    setPageState(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }))
  }, [])

  const setPageSize = useCallback(newLimit => {
    setPageState({ limit: newLimit, offset: 0 })
  }, [])

  const handleSortChange = useCallback(newSortOrder => {
    setSortOrder(newSortOrder)
    setPageState(prev => ({ ...prev, offset: 0 }))
  }, [])

  const resetPagination = useCallback(() => {
    setPageState({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })
  }, [])

  const value = {
    count,
    data: pageData,
    handleSortChange,
    nextPage,
    pageState,
    prevPage,
    resetPagination,
    selectedConcept,
    selectedType,
    setPageSize,
    sortOrder,
  }

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export default HistoryProvider
