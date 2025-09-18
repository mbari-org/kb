import { use, useCallback, useEffect, useState, useRef } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import HistoryContext from './HistoryContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import AppModalContext from '@/contexts/app/AppModalContext'

import { PAGINATION, PROCESSING, SELECTED } from '@/lib/constants'
import useLoadData from '@/contexts/panels/history/useLoadData'
import usePageData from '@/contexts/panels/history/usePageData'
import usePageHistory from '@/contexts/panels/history/usePageHistory'

import { CONCEPT_HISTORY } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const { EXTENT, TYPE } = CONCEPT_HISTORY
const { CONCEPT, PANEL, SETTINGS } = SELECTED
const { HISTORY } = SETTINGS

const HistoryProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)
  const { pendingHistory } = use(PanelDataContext)
  const { setProcessing, setModalData } = use(AppModalContext)
  const { getSelected, getSettings } = use(SelectedContext)

  const selectedConcept = getSelected(CONCEPT)
  const selectedType = getSettings(HISTORY.KEY, HISTORY.TYPE)
  const activePanel = getSelected(PANEL)
  const isActive = activePanel === 'History'

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

  const loadData = useLoadData({
    apiFns,
    conceptData,
    conceptHistoryExtent,
    count,
    pendingHistory,
    selectedConcept,
    selectedType,
    sortOrder,
    typeState,
  })

  const pageData = usePageData({
    apiFns,
    conceptData,
    count,
    selectedConcept,
    selectedType,
    sortOrder,
    typeState,
  })

  useEffect(() => {
    const run = async () => {
      if (!apiFns || !isActive) return
      isTypeChanging.current = true
      const loadingMsg =
        conceptHistoryExtent === EXTENT.CHILDREN
          ? 'Loading children history...'
          : conceptHistoryExtent === EXTENT.DESCENDANTS
            ? 'Loading descendants history...'
            : 'Loading data...'

      // Delay showing the overlay to avoid UI flash on fast operations
      const timer = setTimeout(() => {
        setProcessing(loadingMsg)
      }, PROCESSING.LOADING_DELAY)

      try {
        await loadData({ setCount, setConceptData, setTypeData, setTypeState })
      } finally {
        clearTimeout(timer)
        setProcessing(false)
        isTypeChanging.current = false
      }
    }
    run()
  }, [
    apiFns,
    conceptHistoryExtent,
    isActive,
    loadData,
    pendingHistory,
    selectedConcept,
    selectedType,
    setModalData,
    setProcessing,
  ])

  useEffect(() => {
    const run = async () => {
      if (!apiFns || !isActive || isTypeChanging.current) return
      await pageData({ setTypeData })
    }
    run()
  }, [
    apiFns,
    conceptData,
    count,
    isActive,
    pageData,
    pendingHistory,
    selectedConcept,
    selectedType,
    sortOrder,
    typeState,
  ])

  const { nextPage, prevPage, setPageSize, resetPagination } = usePageHistory({
    count,
    setTypeState,
  })

  const handleSortChange = useCallback(
    newSortOrder => {
      if (selectedType !== TYPE.CONCEPT) {
        setSortOrder(newSortOrder)
        setTypeState(prev => ({ ...prev, offset: 0 }))
      }
    },
    [selectedType]
  )

  const value = {
    conceptData,
    conceptHistoryExtent,
    count,
    data: typeData,
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
