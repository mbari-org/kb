import { use } from 'react'

import {
  getConceptTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { PAGINATION } from '@/lib/constants'

import { escapeCSV, humanTimestamp, writeCSVContent } from '@/lib/util'

const EXPORT_PAGE_SIZE = PAGINATION.TEMPLATES.EXPORT_PAGE_SIZE

const templateDataHeaders = ['Concept', 'Link Name', 'To Concept', 'Link Value', 'Last Updated']

const templateRows = templates =>
  templates.map(template => [
    template.concept,
    template.linkName,
    template.toConcept,
    template.linkValue,
    humanTimestamp(template.lastUpdated),
  ])

const fetchTemplatesByPage = async (apiFns, pageIndex) => {
  return apiFns.apiPaginated(getTemplates, {
    limit: EXPORT_PAGE_SIZE,
    offset: pageIndex * EXPORT_PAGE_SIZE,
  })
}

const formatName = str => (str || 'all').replace(/\s+/g, '-')

const fetchFilteredTemplates = async (data, apiFns) => {
  if (!data) return null

  const hasConceptFilter = data.filterConcept && data.filterConcept !== 'all'
  const hasToConceptFilter = data.filterToConcept && data.filterToConcept !== 'all'

  if (hasConceptFilter && hasToConceptFilter) {
    const conceptTemplates = await apiFns.apiPayload(getConceptTemplates, data.filterConcept)
    return conceptTemplates.filter(template => template.toConcept === data.filterToConcept)
  }

  if (hasConceptFilter) {
    return apiFns.apiPayload(getConceptTemplates, data.filterConcept)
  }

  if (hasToConceptFilter) {
    return apiFns.apiPayload(getToConceptTemplates, data.filterToConcept)
  }

  return null
}

const useTemplatesExport = () => {
  const { apiFns } = use(ConfigContext)
  const { setProcessing } = use(ModalContext)

  const templatesExport = async data => {
    const filterName =
      data?.filterConcept || data?.filterToConcept
        ? formatName(data.filterConcept) + '_to_' + formatName(data.filterToConcept)
        : ''

    try {
      setProcessing(true)
      const handle = await window.showSaveFilePicker({
        suggestedName: `KB-Templates${filterName ? '_' + filterName : ''}.csv`,
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      const writable = await handle.createWritable()
      await writable.write(templateDataHeaders.map(escapeCSV).join(',') + '\n')

      if (data) {
        // Fetch all templates for the current filter
        setProcessing('Writing templates to CSV file...')
        const filteredTemplates = await fetchFilteredTemplates(data, apiFns)
        if (filteredTemplates) {
          await writeCSVContent(writable, templateRows(filteredTemplates))
        }
      } else {
        // Get count just for display purposes
        const totalCount = await apiFns.apiResult(getTemplatesCount)
        const estimatedTotalPages = totalCount ? Math.ceil(totalCount / EXPORT_PAGE_SIZE) : '?'

        let pageIndex = 0
        let hasMoreData = true

        while (hasMoreData) {
          setProcessing(`Writing page ${pageIndex + 1} of ${estimatedTotalPages} to CSV file...`)
          const templates = await fetchTemplatesByPage(apiFns, pageIndex)
          if (!templates || templates.length === 0) {
            hasMoreData = false
            continue
          }
          await writeCSVContent(writable, templateRows(templates))
          pageIndex++
        }
      }

      await writable.close()
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error saving file:', error)
      }
    } finally {
      setProcessing(false)
    }
  }

  return templatesExport
}

export default useTemplatesExport
