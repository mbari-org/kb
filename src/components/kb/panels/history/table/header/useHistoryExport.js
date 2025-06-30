import { use } from 'react'

import { getConceptHistory, getHistory, getHistoryCount } from '@/lib/api/history'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panels/PanelDataContext'
import HistoryContext from '@/contexts/panels/history/HistoryContext'

import { PAGINATION } from '@/lib/constants'

import { capitalize, escapeCSV, humanTimestamp, writeCSVContent } from '@/lib/utils'

const EXPORT_PAGE_SIZE = PAGINATION.HISTORY.EXPORT_PAGE_SIZE

const getHeaders = type => {
  switch (type) {
    case 'concept':
      return [
        'Approved',
        'Field',
        'Action',
        'Creator',
        'Created',
        'Old Value',
        'New Value',
        'Processor',
        'Processed',
      ]
    case 'pending':
      return ['Concept', 'Field', 'Action', 'Creator', 'Created', 'Old Value', 'New Value']
    case 'approved':
      return [
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
    default:
      return []
  }
}

const getRowData = (item, type) => {
  switch (type) {
    case 'concept':
      return [
        item.approved ? 'Yes' : 'Pending',
        item.field,
        item.action,
        item.creatorName,
        humanTimestamp(item.creationTimestamp),
        item.oldValue,
        item.newValue,
        item.processorName,
        humanTimestamp(item.processedTimestamp),
      ]
    case 'pending':
      return [
        item.concept,
        item.field,
        item.action,
        item.creatorName,
        humanTimestamp(item.creationTimestamp),
        item.oldValue,
        item.newValue,
      ]
    case 'approved':
      return [
        item.concept,
        item.field,
        item.action,
        item.creatorName,
        humanTimestamp(item.creationTimestamp),
        item.oldValue,
        item.newValue,
        item.processorName,
        humanTimestamp(item.processedTimestamp),
      ]
    default:
      return []
  }
}

const fetchHistoryByPage = async (type, pageIndex, pageSize, apiFns) => {
  const offset = pageIndex * pageSize
  const response = await apiFns.apiPaginated(getHistory, [
    type,
    { limit: EXPORT_PAGE_SIZE, offset },
  ])
  if (!Array.isArray(response)) {
    return []
  }
  return response
}

const useHistoryExport = () => {
  const { apiFns } = use(ConfigContext)
  const { selectedType, selectedConcept, sortOrder } = use(HistoryContext)
  const { setExporting } = use(PanelDataContext)

  const historyExport = async () => {
    let writable = null
    try {
      setExporting(true)
      const handle = await window.showSaveFilePicker({
        suggestedName:
          selectedType === 'concept'
            ? `KB-${selectedConcept}-History.csv`
            : `KB-${capitalize(selectedType)}-History.csv`,
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      writable = await handle.createWritable()
      const headers = getHeaders(selectedType)
      await writable.write(headers.map(escapeCSV).join(',') + '\n')

      if (selectedType === 'concept' && selectedConcept) {
        // For concept history, get all data at once
        const data = await apiFns.apiPayload(getConceptHistory, selectedConcept)
        if (!data) {
          return
        }
        // Sort the data based on the current sort order
        const sortedData = [...data].sort((a, b) => {
          const comparison = new Date(b.creationTimestamp) - new Date(a.creationTimestamp)
          return sortOrder === 'asc' ? -comparison : comparison
        })
        const rows = sortedData.map(item => getRowData(item, selectedType))
        await writeCSVContent(writable, rows)
      } else {
        // For type history, paginate through all data
        let pageIndex = 0
        let hasMoreData = true

        // Get count just for display purposes
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

          const rows = historyItems.map(item => getRowData(item, selectedType))
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
