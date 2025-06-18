import { use, useCallback, useEffect, useState, useRef } from 'react'

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
  const [conceptData, setConceptData] = useState([])
  const [typeData, setTypeData] = useState([])
  const [typeState, setTypeState] = useState({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })
  const [sortOrder, setSortOrder] = useState('desc')

  const isTypeChanging = useRef(false)

  useEffect(() => {
    const loadCount = async () => {
      if (!apiFns) return

      isTypeChanging.current = true

      if (selectedType === 'concept' && selectedConcept) {
        const data = await apiFns.apiPayload(getConceptHistory, selectedConcept)
        setCount(data.length)
        setConceptData(data)
        setTypeData(data.slice(0, DEFAULT_LIMIT))
      } else {
        const result = await apiFns.apiResult(getHistoryCount, selectedType)
        setCount(result)
        setConceptData([])
      }

      setTypeState({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })

      isTypeChanging.current = false
    }
    loadCount()
  }, [apiFns, selectedType, selectedConcept])

  useEffect(() => {
    const loadData = async () => {
      if (!apiFns || isTypeChanging.current) return

      if (selectedType === 'concept' && selectedConcept) {
        const start = typeState.offset
        const end = start + typeState.limit
        setTypeData(conceptData.slice(start, end))
      } else {
        let actualOffset = typeState.offset
        if (sortOrder === 'asc') {
          actualOffset = Math.max(0, count - typeState.limit - typeState.offset)
        }
        const data = await apiFns.apiPaginated(getHistory, [
          selectedType,
          { ...typeState, offset: actualOffset },
        ])

        const sortedData = sortOrder === 'asc' ? [...data].reverse() : data

        setTypeData(sortedData)
      }
    }
    loadData()
  }, [apiFns, conceptData, count, selectedConcept, selectedType, sortOrder, typeState])

  const nextPage = useCallback(() => {
    setTypeState(prev => ({
      ...prev,
      offset: Math.min(prev.offset + prev.limit, count - prev.limit),
    }))
  }, [count])

  const prevPage = useCallback(() => {
    setTypeState(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }))
  }, [])

  const setPageSize = useCallback(newLimit => {
    setTypeState({ limit: newLimit, offset: 0 })
  }, [])

  const handleSortChange = useCallback(
    newSortOrder => {
      if (selectedType !== 'concept') {
        setSortOrder(newSortOrder)
        setTypeState(prev => ({ ...prev, offset: 0 }))
      }
    },
    [selectedType]
  )

  const resetPagination = useCallback(() => {
    setTypeState({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })
  }, [])

  const value = {
    count,
    data: typeData,
    conceptData,
    typeData,
    typeState,
    handleSortChange,
    nextPage,
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
