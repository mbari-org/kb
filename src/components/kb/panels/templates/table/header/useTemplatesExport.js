import { use, useCallback, useState } from 'react'

import { getAvailableTemplates, getExplicitTemplates, getTemplates, getToConceptTemplates } from '@/lib/api/templates'

import createAppModal from '@/components/modal/app/createAppModal'
import ExportCompleteActions from '@/components/kb/export/ExportCompleteActions'
import ExportCompleteContent from '@/components/kb/export/ExportCompleteContent'
import ExportCompleteTitle from '@/components/kb/export/ExportCompleteTitle'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'

import { PAGINATION } from '@/lib/config/pagination.js'
import { SELECTED } from '@/lib/constants/selected.js'

import CONFIG from '@/lib/config'
import { conceptNameForFilename, humanTimestamp } from '@/lib/utils'

const { EXPORT, PANELS, PROCESSING } = CONFIG

const { COMMENT } = EXPORT
const { EXPORT_TYPE } = PANELS.TEMPLATES.PANEL
const { HEADERS, TITLE } = PANELS.TEMPLATES.EXPORT

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const EXPORT_PAGE_SIZE = PAGINATION.TEMPLATES.EXPORT_PAGE_SIZE

const buildComments = data => {
  const { byAvailable, filterConcept, filterToConcept, linkName, linkValue } = data

  const type = byAvailable ? EXPORT_TYPE.AVAILABLE : EXPORT_TYPE.EXPLICIT
  const comments = [COMMENT.TYPE.replace('{value}', type)]
  const commentFor = (template, value) => value && comments.push(template.replace('{value}', value))

  if (!filterConcept && !filterToConcept && !linkName && !linkValue) {
    return comments
  }

  if (filterConcept && !filterToConcept && !linkName && !linkValue) {
    commentFor(COMMENT.CONCEPT, filterConcept)
    return comments
  }

  commentFor(COMMENT.CONCEPT, filterConcept)
  commentFor(COMMENT.LINK_NAME, linkName)
  commentFor(COMMENT.TO_CONCEPT, filterToConcept)
  commentFor(COMMENT.LINK_VALUE, linkValue)

  return comments
}

const dataHeaders = [
  HEADERS.CONCEPT,
  HEADERS.LINK_NAME,
  HEADERS.TO_CONCEPT,
  HEADERS.LINK_VALUE,
  HEADERS.LAST_UPDATED,
]

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
    return apiFns.apiPayload(data.byAvailable ? getAvailableTemplates : getExplicitTemplates, data.filterConcept)
  }

  if (hasToConceptFilter) {
    return apiFns.apiPayload(getToConceptTemplates, data.filterToConcept)
  }

  return null
}

const useTemplatesExport = () => {
  const { apiFns } = use(ConfigContext)
  const { byAvailable, filters, filteredTemplates } = use(TemplatesContext)
  const { user } = use(UserContext)
  const { beginProcessing, setModal, setModalData } = use(AppModalContext)
  const [processingStop, setProcessingStop] = useState(null)

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
    return filterName.startsWith('_') ? `${baseName}${filterName}.csv` : `${baseName}_${filterName}.csv`
  }

  const paginated =
    !normalizedFilters.displayTemplates && !normalizedFilters.filterConcept && !normalizedFilters.filterToConcept

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
          Actions: ExportCompleteActions,
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
    comments: buildComments(normalizedFilters),
    count,
    estimatedTotalPages,
    getData,
    headers: dataHeaders,
    onProgress,
    paginated,
    suggestName,
    title: TITLE,
    user,
  })
}

export default useTemplatesExport
