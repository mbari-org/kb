import { use, useCallback, useEffect, useMemo, useState } from 'react'

import { getHistory, getHistoryCount } from '@/lib/api/history'

import createAppModal from '@/components/modal/app/createAppModal'
import ExportCompleteContent from '@/components/kb/export/ExportCompleteContent'
import ExportCompleteTitle from '@/components/kb/export/ExportCompleteTitle'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'

import { capitalize } from '@/lib/utils'

import { CONCEPT } from '@/lib/constants'
import { PAGINATION } from '@/lib/constants/pagination.js'
import { SELECTED } from '@/lib/constants/selected.js'

import CONFIG from '@/text'
import { conceptNameForFilename, humanTimestamp } from '@/lib/utils'

const { PROCESSING } = CONFIG

const { TYPE } = CONCEPT.HISTORY
const { CONCEPT: SELECTED_CONCEPT } = SELECTED
const { SOLO } = CONCEPT.EXTENT
const EXPORT_PAGE_SIZE = PAGINATION.HISTORY.EXPORT_PAGE_SIZE

const commentsContent = ({ concept, historyExtent, historyType }) => {
  let content = [`Type: ${capitalize(historyType)}`]
  if (historyExtent) {
    content.push(`Concept: ${concept}`)
    content.push(`Extent: ${capitalize(historyExtent)}`)
  }
  return content
}

const dataHeaders = type => {
  const columnHeaders = [
    'Concept',
    'Field',
    'Action',
    'Creator',
    'Created',
    'Old Value',
    'New Value',
    'Processor',
    'Processed',
  ]

  let headers
  switch (type) {
    case TYPE.CONCEPT:
      headers = ['Approved', ...columnHeaders]
      break

    case TYPE.PENDING:
      headers = columnHeaders.slice(0, 7)
      break

    case TYPE.APPROVED:
      headers = columnHeaders
      break

    default:
      throw new Error(`HistoryExport dataHeaders invalid type: ${type}`)
  }

  return headers
}

const fetchHistory = async (type, pageIndex, pageSize, apiFns) => {
  const offset = pageIndex * pageSize
  const response = await apiFns.apiPaginated(getHistory, [
    type,
    { limit: EXPORT_PAGE_SIZE, offset },
  ])
  return response
}

const rowData = (item, type) => {
  const itemData = [
    item.concept,
    item.field,
    item.action,
    item.creatorName,
    humanTimestamp(item.creationTimestamp),
    item.oldValue,
    item.newValue,
  ]

  switch (type) {
    case TYPE.CONCEPT:
      return [
        item.approved ? 'Yes' : 'Pending',
        ...itemData,
        item.processorName,
        humanTimestamp(item.processedTimestamp),
      ]

    case TYPE.PENDING:
      return itemData

    case TYPE.APPROVED:
      return [...itemData, item.processorName, humanTimestamp(item.processedTimestamp)]
    default:
      return []
  }
}

const useHistoryExport = () => {
  const { apiFns } = use(ConfigContext)
  const { conceptState, selectedType, pageState } = use(HistoryContext)
  const { getSelected } = use(SelectedContext)
  const { user } = use(UserContext)
  const { beginProcessing, setModal, setModalData } = use(AppModalContext)
  const [processingStop, setProcessingStop] = useState(null)

  const selectedConcept = useMemo(() => getSelected(SELECTED_CONCEPT), [getSelected])
  const { data: conceptData, extent: conceptExtent } = conceptState

  const content = commentsContent({
    concept: selectedConcept,
    historyExtent: conceptExtent,
    historyType: selectedType,
  })

  const getConceptData = async () => {
    const sortedData = [...conceptData].sort((a, b) => {
      const comparison = new Date(b.creationTimestamp) - new Date(a.creationTimestamp)
      return pageState.sortOrder === 'asc' ? -comparison : comparison
    })
    return sortedData.map(item => rowData(item, selectedType))
  }

  const getPaginatedData = async pageIndex => {
    const historyItems = await fetchHistory(
      selectedType,
      pageIndex,
      EXPORT_PAGE_SIZE,
      apiFns
    )

    if (!historyItems || historyItems.length === 0) {
      return null
    }

    return historyItems.map(item => rowData(item, selectedType))
  }

  const getEstimatedPages = useCallback(async () => {
    if (selectedType === TYPE.CONCEPT && selectedConcept && conceptData) {
      return null
    }
    const totalCount = await apiFns.apiResult(getHistoryCount, selectedType)
    return totalCount ? Math.ceil(totalCount / EXPORT_PAGE_SIZE) : '?'
  }, [apiFns, conceptData, selectedConcept, selectedType])

  const isConceptExport = selectedType === TYPE.CONCEPT && selectedConcept && conceptData
  const [estimatedPages, setEstimatedPages] = useState(null)

  const suggestName = useCallback(() => {
    if (selectedType === TYPE.CONCEPT) {
      const extent =
        conceptExtent === SOLO ? '' : `_and_${conceptExtent}`
      return `KB-History_${conceptNameForFilename(selectedConcept)}${extent}.csv`
    }
    return `KB-History-${capitalize(selectedType)}.csv`
  }, [selectedType, selectedConcept, conceptExtent])

  useEffect(() => {
    if (!isConceptExport) {
      getEstimatedPages().then(setEstimatedPages)
    }
  }, [getEstimatedPages, isConceptExport, selectedType])

  const onProgress = useCallback(
    value => {
      if (value === false) {
        if (processingStop) {
          processingStop()
          setProcessingStop(null)
        }
      } else if (value?.status === 'done' && value.fileName) {
        if (processingStop) {
          processingStop()
          setProcessingStop(null)
        }
        const modal = createAppModal({
          Content: ExportCompleteContent,
          Title: ExportCompleteTitle,
          minWidth: 420,
          focusClose: true,
        })
        setModalData({ fileName: value.fileName })
        setModal(modal)
      } else if (typeof value === 'string') {
        if (!processingStop) {
          setProcessingStop(() => beginProcessing(PROCESSING.LOAD, value))
        } else if (processingStop.updateMessage) {
          processingStop.updateMessage(value)
        }
      }
    },
    [processingStop, beginProcessing, setModal, setModalData]
  )

  return csvExport({
    comments: content,
    count: conceptData?.length || 0,
    estimatedTotalPages: estimatedPages,
    getData: isConceptExport ? getConceptData : getPaginatedData,
    headers: dataHeaders(selectedType),
    onProgress,
    paginated: !isConceptExport,
    suggestName,
    title: 'Knowledge Base History',
    user,
  })
}

export default useHistoryExport
