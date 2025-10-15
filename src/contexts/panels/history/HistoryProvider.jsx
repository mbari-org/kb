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

import { CONCEPT_EXTENT, CONCEPT_HISTORY } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const { CHILDREN, DESCENDANTS } = CONCEPT_EXTENT
const { TYPE } = CONCEPT_HISTORY
const { CONCEPT, PANEL, SETTINGS } = SELECTED
const { HISTORY } = SETTINGS

const HistoryProvider = ({ children }) => {
  const { setModalData, setProcessing } = use(AppModalContext)
  const { apiFns } = use(ConfigContext)
  const { pendingHistory } = use(PanelDataContext)
  const { getSelected, getSettings } = use(SelectedContext)

  const activePanel = getSelected(PANEL)
  const selectedConcept = getSelected(CONCEPT)
  const selectedType = getSettings(HISTORY.KEY, HISTORY.TYPE)

  const isActive = activePanel === 'History'

  const [conceptState, setConceptState] = useState({
    count: 0,
    data: [],
    extent: CONCEPT_EXTENT.CONCEPT,
  })

  const [pageState, setPageState] = useState({
    data: [],
    lastHistoryType: selectedType !== TYPE.CONCEPT ? selectedType : TYPE.PENDING,
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
    sortOrder: 'desc',
  })

  const updateConceptState = useCallback(updates => {
    setConceptState(prev => ({ ...prev, ...updates }))
  }, [])

  const updatePageState = useCallback(updates => {
    setPageState(prev => ({ ...prev, ...updates }))
  }, [])

  const isTypeChanging = useRef(false)

  useEffect(() => {
    updateConceptState({ extent: CONCEPT_EXTENT.CONCEPT })
  }, [selectedConcept, updateConceptState])

  const loadData = useLoadData({
    apiFns,
    conceptHistoryExtent: conceptState.extent,
    pendingHistory,
  })

  const pageData = usePageData({
    apiFns,
    conceptState,
    pageState,
  })

  useEffect(() => {
    const run = async () => {
      if (!apiFns || !isActive) return
      isTypeChanging.current = true

      if (selectedType !== TYPE.CONCEPT) {
        updatePageState({ lastHistoryType: selectedType })
      }

      const loadingMsg =
        conceptState.extent === CHILDREN
          ? 'Loading children history...'
          : conceptState.extent === DESCENDANTS
            ? 'Loading descendants history...'
            : 'Loading data...'

      // Delay showing the overlay to avoid UI flash on fast operations
      const timer = setTimeout(() => {
        setProcessing(loadingMsg)
      }, PROCESSING.LOADING_DELAY)

      try {
        await loadData({ updateConceptState, updatePageState })
      } finally {
        clearTimeout(timer)
        setProcessing(false)
        isTypeChanging.current = false
      }
    }
    run()
  }, [
    apiFns,
    conceptState.extent,
    isActive,
    loadData,
    pendingHistory,
    selectedConcept,
    selectedType,
    setModalData,
    setProcessing,
    updatePageState,
    updateConceptState,
  ])

  useEffect(() => {
    const run = async () => {
      if (!apiFns || !isActive || isTypeChanging.current) return
      await pageData({ updatePageState })
    }
    run()
  }, [
    apiFns,
    conceptState.data,
    conceptState.count,
    isActive,
    pageData,
    pendingHistory,
    selectedConcept,
    selectedType,
    updatePageState,
    pageState.sortOrder,
  ])

  const { nextPage, prevPage, setPageSize, resetPagination } = usePageHistory({
    count: conceptState.count,
    updatePageState,
  })

  const handleSortChange = useCallback(
    sortOrder => {
      if (selectedType !== TYPE.CONCEPT) {
        updatePageState({ sortOrder, offset: 0 })
      }
    },
    [selectedType, updatePageState]
  )

  const value = {
    conceptState,
    pageState,
    handleSortChange,
    nextPage,
    prevPage,
    resetPagination,
    selectedType,
    setPageSize,
    updatePageState,
    updateConceptState,
  }

  return <HistoryContext value={value}>{children}</HistoryContext>
}

export default HistoryProvider
