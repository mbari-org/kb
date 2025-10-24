import { getConceptAnnotationsCount } from '@/lib/kb/api/annotations'
import { getToConceptAssociationsCount, renameToConceptAssociations } from '@/lib/kb/api/associations'
import {
  getConceptTemplateCount,
  getToConceptTemplateCount,
  renameToConceptTemplates,
} from '@/lib/kb/api/linkTemplates'
import { getConceptObservationsCount, renameConceptObservations } from '@/lib/kb/api/observations'

export const REASSIGNMENT_COUNTS = [
  {
    title: 'Concept Annotation',
    countsFn: getConceptAnnotationsCount,
    renamedFn: null,
  },
  {
    title: 'ToConcept Association',
    countsFn: getToConceptAssociationsCount,
    renamedFn: renameToConceptAssociations,
  },
  {
    title: 'Concept Observation',
    countsFn: getConceptObservationsCount,
    renamedFn: renameConceptObservations,
  },
  {
    title: 'Concept Template',
    countsFn: getConceptTemplateCount,
    renamedFn: null,
  },
  {
    title: 'ToConcept Template',
    countsFn: getToConceptTemplateCount,
    renamedFn: renameToConceptTemplates,
  },
]

export const reassignmentMessage = (key, count) => {
  return `${count} ${key}${count > 1 ? 's' : ''} will be reassigned.`
}

export const associatedInfo = async (apiFns, conceptName, getReferences) => {
  const counts = await Promise.all(REASSIGNMENT_COUNTS.map(({ countsFn }) => apiFns.apiResult(countsFn, conceptName)))

  const associatedCounts = REASSIGNMENT_COUNTS.reduce((acc, { title }, index) => {
    acc[title] = counts[index]
    return acc
  }, {})

  const referencesCount = getReferences ? getReferences(conceptName).length : 0

  const hasReassignmentData = counts.some(count => count > 0)
  const hasReferencesData = referencesCount > 0
  const hasAssociatedData = hasReassignmentData || hasReferencesData

  const associatedMessages = hasReassignmentData
    ? REASSIGNMENT_COUNTS.reduce((messages, { title }, index) => {
        if (counts[index] > 0) {
          messages.push(reassignmentMessage(title, counts[index]))
        }
        return messages
      }, [])
    : ['There is no data that needs to be reassigned.']

  if (hasReferencesData) {
    associatedMessages.push(`${referencesCount} Concept Reference${referencesCount > 1 ? 's' : ''} will be removed.`)
  }

  return { associatedMessages, associatedCounts, hasReassignmentData, hasReferencesData }
}
