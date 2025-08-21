import { use, useCallback, useEffect, useState, useRef } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import HistoryContext from './HistoryContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { PAGINATION, SELECTED } from '@/lib/constants'
import useHistoryData from '@/contexts/panels/history/useHistoryData'
import usePageHistory from '@/contexts/panels/history/usePageHistory'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const { CONCEPT } = SELECTED
const { HISTORY } = SELECTED.SETTINGS

const HistoryProvider = ({ children }) => {
  const { getSelected, getSettings } = use(SelectedContext)
  const { apiFns } = use(ConfigContext)
  const { pendingHistory } = use(PanelDataContext)

  const selectedConcept = getSelected(CONCEPT)
  const selectedType = getSettings(HISTORY.KEY, HISTORY.TYPE)

  const [count, setCount] = useState(0)
  const [conceptData, setConceptData] = useState([])
  const [conceptHistoryExtent, setConceptHistoryExtent] = useState(null)
  const [typeData, setTypeData] = useState([])
  const [typeState, setTypeState] = useState({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET })
  const [sortOrder, setSortOrder] = useState('desc')

  const isTypeChanging = useRef(false)

  useEffect(() => {
    setConceptHistoryExtent(null)
  }, [selectedConcept])

  const { loadCount, loadData } = useHistoryData({
    apiFns,
    conceptData,
    count,
    pendingHistory,
    selectedConcept,
    selectedType,
    sortOrder,
    typeState,
  })

  useEffect(() => {
    const run = async () => {
      if (!apiFns) return
      isTypeChanging.current = true
      await loadCount({ setCount, setConceptData, setTypeData, setTypeState })
      isTypeChanging.current = false
    }
    run()
  }, [apiFns, selectedType, selectedConcept, pendingHistory, loadCount])

  useEffect(() => {
    const run = async () => {
      if (!apiFns || isTypeChanging.current) return
      await loadData({ setTypeData })
    }
    run()
  }, [
    apiFns,
    conceptData,
    count,
    selectedConcept,
    selectedType,
    sortOrder,
    typeState,
    pendingHistory,
    loadData,
  ])

  const { nextPage, prevPage, setPageSize, resetPagination } = usePageHistory({
    count,
    setTypeState,
  })

  const handleSortChange = useCallback(
    newSortOrder => {
      if (selectedType !== 'concept') {
        setSortOrder(newSortOrder)
        setTypeState(prev => ({ ...prev, offset: 0 }))
      }
    },
    [selectedType]
  )


  const value = {
    conceptHistoryExtent,
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
    setConceptHistoryExtent,
    setPageSize,
    sortOrder,
  }

  return <HistoryContext value={value}>{children}</HistoryContext>
}

export default HistoryProvider
