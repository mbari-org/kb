import { use } from 'react'

import {
  getAvailableTemplates,
  getExplicitTemplates,
  getTemplates,
  getToConceptTemplates,
} from '@/lib/kb/api/templates'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'

import { SELECTED } from '@/lib/constants/selected.js'
import { PAGINATION } from '@/lib/constants/pagination.js'

import { conceptNameForFilename, humanTimestamp } from '@/lib/utils'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const EXPORT_PAGE_SIZE = PAGINATION.TEMPLATES.EXPORT_PAGE_SIZE

const buildComments = data => {
  const { byAvailable, filterConcept, filterToConcept, linkName, linkValue } = data

  const comments = [`Type: ${byAvailable ? 'Available' : 'Explicit'}`]

  if (!filterConcept && !filterToConcept && !linkName && !linkValue) {
    return comments
  }

  if (filterConcept && !filterToConcept && !linkName && !linkValue) {
    comments.push(`Concept: ${filterConcept}`)
    return comments
  }

  filterConcept && comments.push(`Concept: ${filterConcept}`)
  linkName && comments.push(`Link Name: ${linkName}`)
  filterToConcept && comments.push(`To Concept: ${filterToConcept}`)
  linkValue && comments.push(`Link Value: ${linkValue}`)

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
      data.byAvailable ? getAvailableTemplates : getExplicitTemplates,
      data.filterConcept
    )
    return conceptTemplates.filter(template => template.toConcept === data.filterToConcept)
  }

  if (hasConceptFilter) {
    return apiFns.apiPayload(
      data.byAvailable ? getAvailableTemplates : getExplicitTemplates,
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
  const {
    byAvailable,
    filters,
    filteredTemplates,
  } = use(TemplatesContext)
  const { user } = use(UserContext)

  const normalizedFilters = {
    byAvailable,
    filterConcept: filters[FILTERS.CONCEPT],
    filterToConcept: filters[FILTERS.TO_CONCEPT],
    linkName: filters[FILTERS.LINK_NAME],
    linkValue: filters[FILTERS.LINK_VALUE],
    displayTemplates: filteredTemplates,
  }

  const filterName = (() => {
    const { filterConcept, filterToConcept, linkName, linkValue } = normalizedFilters

    if (!filterConcept && !filterToConcept && !linkName && !linkValue) {
      return ''
    }

    if (filterConcept && !filterToConcept && !linkName && !linkValue) {
      return `_${conceptNameForFilename(filterConcept)}`
    }

    const conceptName = filterConcept ? conceptNameForFilename(filterConcept) : 'X'
    const linkNameValue = linkName || 'X'
    const toConceptName = filterToConcept ? conceptNameForFilename(filterToConcept) : 'X'
    const linkValueValue = linkValue || 'X'

    return `${conceptName}_${linkNameValue}_${toConceptName}_${linkValueValue}`
  })()

  const availableTag = normalizedFilters.byAvailable ? 'Available' : 'Explicit'
  const suggestName = () => {
    const baseName = `KB-Templates-${availableTag}`
    if (!filterName) {
      return `${baseName}.csv`
    }
    // If filterName starts with underscore, don't add extra underscore
    return filterName.startsWith('_')
      ? `${baseName}${filterName}.csv`
      : `${baseName}_${filterName}.csv`
  }

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

export default useTemplatesExport
