import { getConceptAnnotationsCount } from '@/lib/kb/api/annotations'
import { getToConceptAssociationsCount } from '@/lib/kb/api/associations'
import {
  getConceptTemplateCount,
  getToConceptTemplateCount,
  renameToConceptTemplates,
} from '@/lib/kb/api/templates'
import { renameConceptObservations } from '@/lib/kb/api/observations'
import { renameToConceptAssociations } from '@/lib/kb/api/associations'

export const RELATED_DATA_COUNTS = {
  ANNOTATIONS: 'Concept Annotations / Observations',
  ASSOCIATIONS: 'Associations To Concept',
  REALIZATIONS: 'Concept Link Realizations',
  TEMPLATES_DEFINED: 'Templates defined for Concept',
  TEMPLATES_TO: 'Templates To Concept',
  REFERENCES: 'References To Concept',
}

export const relatedDataCounts = async ({
  apiFns,
  concept,
  getReferences,
}) => {
  const config = [
    {
      title: RELATED_DATA_COUNTS.ANNOTATIONS,
      apiCountFn: getConceptAnnotationsCount,
      reassignFn: payload => apiFns.apiPayload(renameConceptObservations, payload),
    },
    {
      title: RELATED_DATA_COUNTS.ASSOCIATIONS,
      apiCountFn: getToConceptAssociationsCount,
      reassignFn: payload => apiFns.apiPayload(renameToConceptAssociations, [payload.old, payload.new]),
    },
    {
      title: RELATED_DATA_COUNTS.REALIZATIONS,
      localCountFn: () => concept.realizations.length,
    },
    {
      title: RELATED_DATA_COUNTS.TEMPLATES_DEFINED,
      apiCountFn: getConceptTemplateCount,
    },
    {
      title: RELATED_DATA_COUNTS.TEMPLATES_TO,
      apiCountFn: getToConceptTemplateCount,
      reassignFn: payload => apiFns.apiPayload(renameToConceptTemplates, payload),
    },
    {
      title: RELATED_DATA_COUNTS.REFERENCES,
      localCountFn: conceptName => getReferences(conceptName).length,
    },
  ]

  const counts = []
  for (const { title, apiCountFn, localCountFn } of config) {
    const countFn = apiCountFn
      ? () => apiFns?.apiResult(apiCountFn, concept.name)
      : () => localCountFn(concept.name)

    const value = await countFn()
    counts.push({ title, value, reassignFn: config.find(c => c.title === title).reassignFn })
  }

  return counts
}
