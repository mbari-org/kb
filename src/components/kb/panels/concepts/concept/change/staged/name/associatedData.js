import { getConceptAnnotationsCount } from '@/lib/kb/api/annotations'
import { getToConceptAssociationsCount, renameToConceptAssociations } from '@/lib/kb/api/associations'
import {
  getConceptTemplateCount,
  getToConceptTemplateCount,
  renameToConceptTemplates,
} from '@/lib/kb/api/linkTemplates'
import { getConceptObservationsCount, renameConceptObservations } from '@/lib/kb/api/observations'

export const ASSOCIATED_COUNTS = [
  {
    title: 'Concept Annotations',
    countFn: getConceptAnnotationsCount,
    renameFn: null,
  },
  {
    title: 'ToConcept Associations',
    countFn: getToConceptAssociationsCount,
    renameFn: renameToConceptAssociations,
  },
  {
    title: 'Concept Observations',
    countFn: getConceptObservationsCount,
    renameFn: renameConceptObservations,
  },
  {
    title: 'Concept Templates',
    countFn: getConceptTemplateCount,
    renameFn: null,
  },
  {
    title: 'ToConcept Templates',
    countFn: getToConceptTemplateCount,
    renameFn: renameToConceptTemplates,
  },
]

export const associatedMessage = (key, count) => {
  return `There ${count > 1 ? 'are' : 'is'} ${count} ${key} that need to be reassigned.`
}

export const associatedInfo = async (apiFns, conceptName) => {
  const counts = await Promise.all(ASSOCIATED_COUNTS.map(({ countFn }) => apiFns.apiResult(countFn, conceptName)))

  const countsByTitle = ASSOCIATED_COUNTS.reduce((acc, { title }, index) => {
    acc[title] = counts[index]
    return acc
  }, {})

  const hasAssociatedData = counts.some(count => count > 0)

  const associatedMessages = hasAssociatedData
    ? ASSOCIATED_COUNTS.reduce((messages, { title }, index) => {
        if (counts[index] > 0) {
          messages.push(associatedMessage(title, counts[index]))
        }
        return messages
      }, [])
    : ['There is no data that needs to be reassigned.']

  return { associatedMessages, countsByTitle, hasAssociatedData }
}
