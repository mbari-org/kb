import { getConceptAnnotationsCount } from '@/lib/api/annotations'
import { getToConceptAssociationsCount, renameToConceptAssociations } from '@/lib/api/associations'
import { renameConceptObservations } from '@/lib/api/observations'
import {
  getConceptRealizationCount,
  getToConceptRealizationsCount,
  renameToConceptRealizations,
} from '@/lib/api/realizations'
import { getConceptTemplateCount, getToConceptTemplateCount, renameToConceptTemplates } from '@/lib/api/templates'

import CONFIG from '@/lib/config'

const { RELATED_DATA_COUNTS, RELATED_DATA_TYPE } = CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME

export { RELATED_DATA_COUNTS, RELATED_DATA_TYPE }

export const hasRelatedData = counts =>
  counts.some(
    count =>
      count.title !== RELATED_DATA_COUNTS.TEMPLATES_DEFINED &&
      count.title !== RELATED_DATA_COUNTS.REALIZATIONS &&
      count.value > 0
  )

export const performReassignments = async (conceptName, newConceptName, relatedDataCounts) => {
  const reassignmentPromises = relatedDataCounts
    .filter(count => count.value > 0 && count.reassignFn)
    .map(count => count.reassignFn({ old: conceptName, new: newConceptName }))

  return Promise.all(reassignmentPromises)
}

export const relatedDataCounts = async ({ apiFns, concept, getReferences, renamedFrom }) => {
  const config = [
    {
      title: RELATED_DATA_COUNTS.ANNOTATIONS,
      type: RELATED_DATA_TYPE.ANNOTATIONS,
      apiCountFn: getConceptAnnotationsCount,
      reassignFn: payload => apiFns.apiPayload(renameConceptObservations, payload),
      byNameString: true,
    },
    {
      title: RELATED_DATA_COUNTS.ASSOCIATIONS,
      type: RELATED_DATA_TYPE.ANNOTATIONS,
      apiCountFn: getToConceptAssociationsCount,
      reassignFn: payload => apiFns.apiPayload(renameToConceptAssociations, payload),
      byNameString: true,
    },
    {
      title: RELATED_DATA_COUNTS.REALIZATIONS,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      apiCountFn: getConceptRealizationCount,
      conceptBound: true,
    },
    {
      title: RELATED_DATA_COUNTS.REALIZATIONS_TO,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      apiCountFn: getToConceptRealizationsCount,
      reassignFn: payload => apiFns.apiPayload(renameToConceptRealizations, payload),
      byNameString: true,
    },
    {
      title: RELATED_DATA_COUNTS.REFERENCES,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      localCountFn: conceptName => getReferences(conceptName).length,
    },
    {
      title: RELATED_DATA_COUNTS.TEMPLATES_DEFINED,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      apiCountFn: getConceptTemplateCount,
      conceptBound: true,
    },
    {
      title: RELATED_DATA_COUNTS.TEMPLATES_TO,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      apiCountFn: getToConceptTemplateCount,
      reassignFn: payload => apiFns.apiPayload(renameToConceptTemplates, payload),
      byNameString: true,
    },
  ]

  const counts = []
  for (const { title, type, apiCountFn, localCountFn, reassignFn, byNameString, conceptBound } of config) {
    if (renamedFrom && conceptBound) continue

    const countName = renamedFrom && byNameString ? renamedFrom : concept.name
    const countFn = apiCountFn ? () => apiFns?.apiResult(apiCountFn, countName) : () => localCountFn(countName)

    const value = await countFn()
    counts.push({ title, type, value, reassignFn })
  }

  return counts
}
