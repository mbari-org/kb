import { use } from 'react'

import {
  getAvailableTemplates,
  getExplicitTemplates,
  getTemplates,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'

import { PAGINATION } from '@/lib/constants'

import { conceptNameForFilename, humanTimestamp } from '@/lib/utils'

const EXPORT_PAGE_SIZE = PAGINATION.TEMPLATES.EXPORT_PAGE_SIZE

const buildComments = data => {
  const comments = []
  comments.push(`Type: ${data.available ? 'Available' : 'Explicit'}`)
  if (data.filterConcept) {
    comments.push(`Concept: ${data.filterConcept}`)
  }
  if (data.filterToConcept) {
    comments.push(`To Concept: ${data.filterToConcept}`)
  }
  return comments
}

const dataHeaders = ['Concept', 'Link Name', 'To Concept', 'Link Value', 'Last Updated']

const dataRows = templates =>
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
  const { user } = use(UserContext)

  return data => {
    const normalizedFilters = {
      available: data.available,
      filterConcept: data.concept,
      filterToConcept: data.toConcept,
      displayTemplates: data.filteredTemplates,
    }

    const filterName =
      normalizedFilters.filterConcept || normalizedFilters.filterToConcept
        ? conceptNameForFilename(normalizedFilters.filterConcept) +
          '-to-' +
          conceptNameForFilename(normalizedFilters.filterToConcept)
        : 'all'

    const availableTag = normalizedFilters.available ? 'Available_' : 'Explicit_'
    const suggestName = () => `KB-Templates-${availableTag}${filterName}.csv`

    const paginated = !normalizedFilters.displayTemplates &&
      !normalizedFilters.filterConcept &&
      !normalizedFilters.filterToConcept

    const count = normalizedFilters.displayTemplates?.length ?? '?'
    const estimatedTotalPages = null

    const getData = async (pageIndex = 0) => {
      if (normalizedFilters.displayTemplates?.length > 0) {
        return dataRows(normalizedFilters.displayTemplates)
      }

      if (normalizedFilters.filterConcept || normalizedFilters.filterToConcept) {
        const filtered = await fetchFilteredTemplates(normalizedFilters, apiFns)
        return filtered ? dataRows(filtered) : []
      }

      const pagedTemplates = await fetchTemplatesByPage(apiFns, pageIndex)
      return pagedTemplates?.length > 0 ? dataRows(pagedTemplates) : null
    }

    return csvExport({
      comments: buildComments(normalizedFilters),
      count,
      estimatedTotalPages,
      getData,
      headers: dataHeaders,
      onProgress: setExporting,
      paginated,
      suggestName,
      title: 'Knowledge Base Templates Export',
      user,
    })
  }
}

export default useTemplatesExport
