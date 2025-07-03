import { use } from 'react'

import {
  getAvailableTemplates,
  getExplicitTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { PAGINATION } from '@/lib/constants'

import {
  escapeCSV,
  formatConceptNameForFilename,
  humanTimestamp,
  writeCSVContent,
} from '@/lib/utils'

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

const fetchFilteredTemplates = async (data, apiFns) => {
  if (!data) return null

  const hasConceptFilter = data.filterConcept && data.filterConcept !== 'all'
  const hasToConceptFilter = data.filterToConcept && data.filterToConcept !== 'all'

  if (hasConceptFilter && hasToConceptFilter) {
    const conceptTemplates = await apiFns.apiPayload(
      data.available ? getAvailableTemplates : getExplicitTemplates,
      data.filterConcept
    )
    return conceptTemplates.filter(template => template.toConcept === data.filterToConcept)
  }

  if (hasConceptFilter) {
    return apiFns.apiPayload(
      data.available ? getAvailableTemplates : getExplicitTemplates,
      data.filterConcept
    )
  }

  if (hasToConceptFilter) {
    return apiFns.apiPayload(getToConceptTemplates, data.filterToConcept)
  }

  return null
}

const useTemplatesExport = () => {
  const { apiFns } = use(ConfigContext)
  const { setExporting } = use(PanelDataContext)

  const templatesExport = async data => {
    const filterName =
      data?.filterConcept || data?.filterToConcept
        ? formatConceptNameForFilename(data.filterConcept) +
          '-to-' +
          formatConceptNameForFilename(data.filterToConcept)
        : 'all'

    // Add '_Available' suffix when available flag is on
    const availableTag = data?.available ? 'Available_' : 'Explicit_'
    const suggestedName = `KB-Templates-${availableTag}${filterName}.csv`

    try {
      setExporting(true)
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      const writable = await handle.createWritable()
      await writable.write(templateDataHeaders.map(escapeCSV).join(',') + '\n')

      // If displayTemplates are provided, use them directly (matches what user sees in table)
      if (data.displayTemplates && data.displayTemplates.length > 0) {
        setExporting('Writing templates to CSV file...')
        await writeCSVContent(writable, templateRows(data.displayTemplates))
      } else if (data.filterConcept || data.filterToConcept) {
        // Fetch all templates for the current filter
        setExporting('Writing templates to CSV file...')
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
          setExporting(`Writing page ${pageIndex + 1} of ${estimatedTotalPages} to CSV file...`)
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
      setExporting(false)
    }
  }

  return templatesExport
}

export default useTemplatesExport
