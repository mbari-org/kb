import { use, useCallback, useEffect, useState, useRef } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import HistoryContext from './HistoryContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import AppModalContext from '@/contexts/app/AppModalContext'

import CONFIG from '@/lib/config'
import { SELECTED } from '@/lib/constants/selected.js'
import { PAGINATION } from '@/lib/constants/pagination.js'
import useLoadHistoryData from '@/contexts/panels/history/useLoadHistoryData'
import usePageData from '@/contexts/panels/history/usePageData'
import usePageHistory from '@/contexts/panels/history/usePageHistory'

import { CONCEPT } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.HISTORY.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const { CHILDREN, DESCENDANTS, SOLO } = CONCEPT.EXTENT
const { TYPE } = CONCEPT.HISTORY
const { CONCEPT: SELECTED_CONCEPT, PANEL, SETTINGS } = SELECTED
const { HISTORY } = SETTINGS
const { PROCESSING } = CONFIG

const LOADING_DELAY = 200

const HistoryProvider = ({ children }) => {
  const { beginProcessing } = use(AppModalContext)
  const { apiFns } = use(ConfigContext)
  const { pendingHistory } = use(PanelDataContext)
  const { getSelected } = use(SelectedContext)
  const { getSettings, updateSettings } = use(SelectedSettingsContext)

  const activePanel = getSelected(PANEL)
  const selectedConcept = getSelected(SELECTED_CONCEPT)
  const selectedType = getSettings(HISTORY.KEY, HISTORY.TYPE)

  const isActive = activePanel === 'History'

  const historySort = getSettings(HISTORY.KEY, HISTORY.SORT.KEY)
  const { field: sortField, order: sortOrder } = historySort?.[selectedType] || HISTORY.SORT.DEFAULT

  const [conceptState, setConceptState] = useState({
    count: 0,
    data: [],
    extent: SOLO,
  })

  const [pageState, setPageState] = useState({
    data: [],
    lastHistoryType: selectedType !== TYPE.CONCEPT ? selectedType : TYPE.PENDING,
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
  })

  const updateConceptState = useCallback(updates => {
    setConceptState(prev => ({ ...prev, ...updates }))
  }, [])

  const updatePageState = useCallback(updates => {
    setPageState(prev => ({ ...prev, ...updates }))
  }, [])

  const updateSort = useCallback(
    ({ field, order }) => {
      updateSettings({
        [HISTORY.KEY]: {
          [HISTORY.SORT.KEY]: {
            ...getSettings(HISTORY.KEY, HISTORY.SORT.KEY),
            [selectedType]: {
              [HISTORY.SORT.FIELD]: field,
              [HISTORY.SORT.ORDER]: order,
            },
          },
        },
      })
      updatePageState({ offset: 0 })
    },
    [getSettings, selectedType, updatePageState, updateSettings]
  )

  const isTypeChanging = useRef(false)

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      updateConceptState({ extent: SOLO })
    }, 0)
    return () => globalThis.clearTimeout(timeoutId)
  }, [selectedConcept, updateConceptState])

  const loadData = useLoadHistoryData({
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

      const processingArg =
        conceptState.extent === CHILDREN
          ? PROCESSING.ARG.HISTORY.CHILDREN
          : conceptState.extent === DESCENDANTS
            ? PROCESSING.ARG.HISTORY.DESCENDANTS
            : PROCESSING.ARG.HISTORY.DATA

      const stopProcessing = beginProcessing(PROCESSING.LOAD, processingArg, {
        delayMs: LOADING_DELAY,
      })

      try {
        await loadData({ updateConceptState, updatePageState })
      } finally {
        stopProcessing()
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
    beginProcessing,
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
    sortField,
    sortOrder,
    updatePageState,
    pageState.offset,
  ])

  const { nextPage, prevPage, setPageSize, resetPagination, goToPage } = usePageHistory({
    count: conceptState.count,
    limit: pageState.limit,
    offset: pageState.offset,
    updatePageState,
  })

  const value = {
    conceptState,
    pageState,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
    selectedType,
    setPageSize,
    sortField,
    sortOrder,
    updateConceptState,
    updatePageState,
    updateSort,
  }

  return <HistoryContext value={value}>{children}</HistoryContext>
}

export default HistoryProvider
