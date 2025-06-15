import { use } from 'react'

import {
  getConceptTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

import ConfigContext from '@/contexts/config/ConfigContext'

import { PAGINATION } from '@/lib/constants'

import { escapeCSV, humanTimestamp, writeCSVContent } from '@/lib/util'

const templateDataHeaders = ['Concept', 'Link Name', 'To Concept', 'Link Value', 'Last Updated']

const templateRows = templates =>
  templates.map(template => [
    template.concept,
    template.linkName,
    template.toConcept,
    template.linkValue,
    humanTimestamp(template.lastUpdated),
  ])

const fetchTemplatesByPage = async (apiFns, pageIndex, templatesPerPage) => {
  return apiFns.apiPaginated(getTemplates, {
    limit: templatesPerPage,
    offset: pageIndex * templatesPerPage,
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

  const templatesExport = async data => {
    const filterName = data
      ? formatName(data.filterConcept) + '_to_' + formatName(data.filterToConcept)
      : 'all'

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `KB-Templates_${filterName}.csv`,
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
        const filteredTemplates = await fetchFilteredTemplates(data, apiFns)
        if (filteredTemplates) {
          await writeCSVContent(writable, templateRows(filteredTemplates))
        }
      } else {
        const totalCount = await apiFns.apiResult(getTemplatesCount)
        if (!totalCount) return

        const templatesPerPage =
          PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS[PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS.length - 1]
        const totalPages = Math.ceil(totalCount / templatesPerPage)

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
          const templates = await fetchTemplatesByPage(apiFns, pageIndex, templatesPerPage)
          await writeCSVContent(writable, templateRows(templates))
        }
      }

      await writable.close()
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error saving file:', error)
      }
    }
  }

  return templatesExport
}

export default useTemplatesExport
