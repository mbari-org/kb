import { use } from 'react'

import { getHistory, getHistoryCount } from '@/lib/api/history'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import UserContext from '@/contexts/user/UserContext'

import { capitalize } from '@/lib/utils'

import { CONCEPT_HISTORY, PAGINATION } from '@/lib/constants'

import {
  conceptNameInFilename,
  csvHeaders,
  humanTimestamp,
  writeCSVContent,
} from '@/lib/utils'

const { EXTENT, TYPE } = CONCEPT_HISTORY
const EXPORT_PAGE_SIZE = PAGINATION.HISTORY.EXPORT_PAGE_SIZE

const csvComments = ({ concept, historyExtent, historyType, user }) => {
  var comments = '# Knowledge Base History Export\n'
  comments += `#   Type: ${capitalize(historyType)}\n`
  if (historyExtent) {
    comments += `#   Concept: ${concept}\n`
    comments += `#   History Extent: ${capitalize(historyExtent)}\n`
  }
  comments += `#   Exported By: ${user.name}\n`
  comments += `#   Date: ${humanTimestamp(new Date())}\n`
  comments += '#\n'
  return comments
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

const fetchHistoryByPage = async (type, pageIndex, pageSize, apiFns) => {
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
    return `KB-History-${conceptNameInFilename(conceptName)}${extent}.csv`
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

  const historyExport = async () => {
    let writable = null
    try {
      setExporting('Exporting history to CSV file...')
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName({
          type: selectedType,
          conceptName: selectedConcept,
          historyExtent: conceptHistoryExtent,
        }),
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      writable = await handle.createWritable()
      await writable.write(
        csvComments({
          concept: selectedConcept,
          historyExtent: conceptHistoryExtent,
          historyType: selectedType,
          user,
        })
      )

      await writable.write(csvHeaders(dataHeaders(selectedType)))
      if (selectedType === TYPE.CONCEPT && selectedConcept) {
        if (!conceptData) {
          return
        }

        const sortedData = [...conceptData].sort((a, b) => {
          const comparison = new Date(b.creationTimestamp) - new Date(a.creationTimestamp)
          return sortOrder === 'asc' ? -comparison : comparison
        })
        const rows = sortedData.map(item => rowData(item, selectedType))
        await writeCSVContent(writable, rows)
      } else {
        let pageIndex = 0
        let hasMoreData = true

        const totalCount = await apiFns.apiResult(getHistoryCount, selectedType)
        const estimatedTotalPages = totalCount ? Math.ceil(totalCount / EXPORT_PAGE_SIZE) : '?'

        while (hasMoreData) {
          setExporting(`Exporting page ${pageIndex} of ${estimatedTotalPages} to CSV file...`)
          const historyItems = await fetchHistoryByPage(
            selectedType,
            pageIndex,
            EXPORT_PAGE_SIZE,
            apiFns
          )

          if (!historyItems || historyItems.length === 0) {
            hasMoreData = false
            continue
          }

          const rows = historyItems.map(item => rowData(item, selectedType))
          await writeCSVContent(writable, rows)
          pageIndex++
        }
      }

      await writable.close()
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error saving file:', error)
      }
      if (writable) {
        try {
          await writable.close()
        } catch (closeError) {
          console.error('Error closing writable:', closeError)
        }
      }
    } finally {
      setExporting(false)
    }
  }

  return historyExport
}

export default useHistoryExport
