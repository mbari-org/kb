import { use } from 'react'

import {
  getAvailableTemplates,
  getExplicitTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import UserContext from '@/contexts/user/UserContext'

import createCsvExport from '@/lib/csvExport'

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

  const templatesExport = async data => {
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
    const suggestedName = `KB-Templates-${availableTag}${filterName}.csv`

    const requiresPagination = !normalizedFilters.displayTemplates && 
      !normalizedFilters.filterConcept && 
      !normalizedFilters.filterToConcept

    let estimatedTotalPages = null
    let totalCount = 0
    let filteredTemplates = null

    if (requiresPagination) {
      totalCount = await apiFns.apiResult(getTemplatesCount)
      estimatedTotalPages = totalCount ? Math.ceil(totalCount / EXPORT_PAGE_SIZE) : null
    } else if (normalizedFilters.displayTemplates) {
      totalCount = normalizedFilters.displayTemplates.length
    } else {
      filteredTemplates = await fetchFilteredTemplates(normalizedFilters, apiFns)
      totalCount = filteredTemplates ? filteredTemplates.length : 0
    }

    const getData = async (pageIndex = 0) => {
      if (normalizedFilters.displayTemplates?.length > 0) {
        return dataRows(normalizedFilters.displayTemplates)
      }

      if (normalizedFilters.filterConcept || normalizedFilters.filterToConcept) {
        return filteredTemplates ? dataRows(filteredTemplates) : []
      }

      const pagedTemplates = await fetchTemplatesByPage(apiFns, pageIndex)
      return pagedTemplates?.length > 0 ? dataRows(pagedTemplates) : null
    }

    const exportFn = createCsvExport({
      comments: buildComments(normalizedFilters),
      count: totalCount,
      estimatedTotalPages,
      getData,
      headers: dataHeaders,
      onProgress: setExporting,
      paginated: requiresPagination,
      suggestedName: () => suggestedName,
      title: 'Knowledge Base Templates Export',
      user,
    })

    return exportFn()
  }

  return templatesExport
}

export default useTemplatesExport
