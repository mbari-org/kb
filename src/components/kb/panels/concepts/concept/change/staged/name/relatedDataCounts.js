import { getConceptAnnotationsCount } from '@/lib/api/annotations'
import { getToConceptAssociationsCount, renameToConceptAssociations } from '@/lib/api/associations'
import { renameConceptObservations } from '@/lib/api/observations'
import {
  getConceptTemplateCount,
  getToConceptTemplateCount,
  renameToConceptTemplates,
} from '@/lib/api/templates'

export const RELATED_DATA_COUNTS = {
  ANNOTATIONS: 'Concept Annotations / Observations',
  ASSOCIATIONS: 'Associations To Concept',
  REALIZATIONS: 'Concept Link Realizations',
  TEMPLATES_DEFINED: 'Templates defined for Concept',
  TEMPLATES_TO: 'Templates To Concept',
  REFERENCES: 'References To Concept',
}

export const RELATED_DATA_TYPE = {
  ANNOTATIONS: 'Annotations',
  KNOWLEDGE_BASE: 'Knowledge Base',
}

export const relatedDataCounts = async ({
  apiFns,
  concept,
  getReferences,
}) => {
  const config = [
    {
      title: RELATED_DATA_COUNTS.ANNOTATIONS,
      type: RELATED_DATA_TYPE.ANNOTATIONS,
      apiCountFn: getConceptAnnotationsCount,
      reassignFn: payload => apiFns.apiPayload(renameConceptObservations, payload),
    },
    {
      title: RELATED_DATA_COUNTS.ASSOCIATIONS,
      type: RELATED_DATA_TYPE.ANNOTATIONS,
      apiCountFn: getToConceptAssociationsCount,
      reassignFn: payload => apiFns.apiPayload(renameToConceptAssociations, [payload.old, payload.new]),
    },
    {
      title: RELATED_DATA_COUNTS.REALIZATIONS,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      localCountFn: () => concept.realizations.length,
    },
    {
      title: RELATED_DATA_COUNTS.TEMPLATES_DEFINED,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      apiCountFn: getConceptTemplateCount,
    },
    {
      title: RELATED_DATA_COUNTS.TEMPLATES_TO,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      apiCountFn: getToConceptTemplateCount,
      reassignFn: payload => apiFns.apiPayload(renameToConceptTemplates, payload),
    },
    {
      title: RELATED_DATA_COUNTS.REFERENCES,
      type: RELATED_DATA_TYPE.KNOWLEDGE_BASE,
      localCountFn: conceptName => getReferences(conceptName).length,
    },
  ]

  const counts = []
  for (const { title, type, apiCountFn, localCountFn } of config) {
    const countFn = apiCountFn
      ? () => apiFns?.apiResult(apiCountFn, concept.name)
      : () => localCountFn(concept.name)

    const value = await countFn()
    counts.push({ title, type, value, reassignFn: config.find(c => c.title === title).reassignFn })
  }

  return counts
}
