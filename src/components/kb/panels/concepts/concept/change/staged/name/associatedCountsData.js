import { getConceptAnnotationsCount } from '@/lib/kb/api/annotations'
import { getToConceptAssociationsCount } from '@/lib/kb/api/associations'
import {
  getConceptTemplateCount,
  getToConceptTemplateCount,
} from '@/lib/kb/api/linkTemplates'
import { getConceptObservationsCount } from '@/lib/kb/api/observations'

export const ASSOCIATION_INFO = [
  {
    title: 'Concept Annotation',
    countsFn: getConceptAnnotationsCount,
  },
  {
    title: 'ToConcept Association',
    countsFn: getToConceptAssociationsCount,
  },
  {
    title: 'Concept Observation',
    countsFn: getConceptObservationsCount,
  },
  {
    title: 'Concept Template',
    countsFn: getConceptTemplateCount,
  },
  {
    title: 'ToConcept Template',
    countsFn: getToConceptTemplateCount,
  },
]

export const renamedMessage = (key, count) => {
  return `${count} ${key}${count > 1 ? 's' : ''} will be reassigned.`
}

export const associatedInfo = async (apiFns, conceptName, getReferences) => {
  const counts = await Promise.all(ASSOCIATION_INFO.map(({ countsFn }) => apiFns.apiResult(countsFn, conceptName)))

  const associatedCounts = ASSOCIATION_INFO.reduce((acc, { title }, index) => {
    acc[title] = counts[index]
    return acc
  }, {})

  const referencesCount = getReferences ? getReferences(conceptName).length : 0

  const hasReassignmentData = counts.some(count => count > 0)
  const hasReferencesData = referencesCount > 0

  const associatedMessages = hasReassignmentData
    ? ASSOCIATION_INFO.reduce((messages, { title }, index) => {
        if (counts[index] > 0) {
          messages.push(renamedMessage(title, counts[index]))
        }
        return messages
      }, [])
    : ['There is no data that needs to be reassigned.']

  if (hasReferencesData) {
    associatedMessages.push(`${referencesCount} Concept Reference${referencesCount > 1 ? 's' : ''} will be removed.`)
  }

  return { associatedMessages, associatedCounts, hasReassignmentData, hasReferencesData }
}
