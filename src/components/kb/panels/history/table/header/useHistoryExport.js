import { use, useEffect, useState } from 'react'

import { getHistory, getHistoryCount } from '@/lib/api/history'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'

import { capitalize } from '@/lib/utils'

import { CONCEPT_HISTORY, PAGINATION } from '@/lib/constants'

import { conceptNameForFilename, humanTimestamp } from '@/lib/utils'

const { EXTENT, TYPE } = CONCEPT_HISTORY
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

const fileName = ({ conceptName, historyExtent, type }) => {
  if (type === TYPE.CONCEPT) {
    const extent =
      historyExtent === EXTENT.CONCEPT ? '' : `-and-${historyExtent}`
    return `KB-History-${conceptNameForFilename(conceptName)}${extent}.csv`
  }
  return `KB-History-${capitalize(type)}.csv`
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
  const { conceptData, conceptHistoryExtent, selectedType, selectedConcept, sortOrder } = use(HistoryContext)
  const { setExporting } = use(PanelDataContext)
  const { user } = use(UserContext)

  const content = commentsContent({
    concept: selectedConcept,
    historyExtent: conceptHistoryExtent,
    historyType: selectedType,
  })

  const getConceptData = async () => {
    const sortedData = [...conceptData].sort((a, b) => {
      const comparison = new Date(b.creationTimestamp) - new Date(a.creationTimestamp)
      return sortOrder === 'asc' ? -comparison : comparison
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

  const getEstimatedPages = async () => {
    if (selectedType === TYPE.CONCEPT && selectedConcept && conceptData) {
      return null
    }
    const totalCount = await apiFns.apiResult(getHistoryCount, selectedType)
    return totalCount ? Math.ceil(totalCount / EXPORT_PAGE_SIZE) : '?'
  }

  const isConceptExport = selectedType === TYPE.CONCEPT && selectedConcept && conceptData
  const [estimatedPages, setEstimatedPages] = useState(null)

  useEffect(() => {
    if (!isConceptExport) {
      getEstimatedPages().then(setEstimatedPages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, isConceptExport])

  const historyExport = csvExport({
    comments: content,
    count: conceptData?.length || 0,
    estimatedTotalPages: estimatedPages,
    getData: isConceptExport ? getConceptData : getPaginatedData,
    headers: dataHeaders(selectedType),
    onProgress: setExporting,
    paginated: !isConceptExport,
    suggestedName: () => fileName({
      type: selectedType,
      conceptName: selectedConcept,
      historyExtent: conceptHistoryExtent,
    }),
    title: 'Knowledge Base History',
    user,
  })

  return historyExport
}

export default useHistoryExport
