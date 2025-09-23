import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import DeleteConceptContent from './DeleteConceptContent'
import DeleteConceptActions from './DeleteConceptActions'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { getConceptAnnotationsCount } from '@/lib/api/annotations'
import { getToConceptAssociationsCount, renameToConceptAssociations } from '@/lib/api/associations'
import { getConceptObservationsCount, renameConceptObservations } from '@/lib/api/observations'
import { getConceptTemplateCount, getToConceptTemplateCount, renameToConceptTemplates } from '@/lib/api/linkTemplates'

export const REASSIGNMENTS = {
  CONCEPT_ANNOTATIONS: {
    title: 'Concept Annotations',
    countFn: getConceptAnnotationsCount,
    renameFn: null,
  },
  TO_CONCEPT_ASSOCIATIONS: {
    title: 'ToConcept Associations',
    countFn: getToConceptAssociationsCount,
    renameFn: renameToConceptAssociations,
  },
  CONCEPT_OBSERVATIONS: {
    title: 'Concept Observations',
    countFn: getConceptObservationsCount,
    renameFn: renameConceptObservations,
  },
  CONCEPT_TEMPLATES: {
    title: 'Concept Templates',
    countFn: getConceptTemplateCount,
    renameFn: null,
  },
  TO_CONCEPT_TEMPLATES: {
    title: 'ToConcept Templates',
    countFn: getToConceptTemplateCount,
    renameFn: renameToConceptTemplates,
  },
}

const reassignmentMessage = (key, count) => {
  return `There ${count > 1 ? 'are' : 'is'} ${count} ${key} that need to be reassigned.`
}

const useDeleteConceptModal = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const deleteConceptModal = useCallback(async () => {
    setModalData(prev => ({
      ...prev,
      alert: null,
      hasReassignmentData: false,
      isLoading: true,
      isValid: true,
      modified: true,
      reassignTo: concept.parent,
      reassignmentCounts: [],
      reassignmentMessages: [],
    }))

    const counts = await Promise.all(
      Object.values(REASSIGNMENTS).map(({ countFn }) =>
        apiFns.apiResult(countFn, concept.name)
      )
    )

    const hasReassignmentData = counts.some(count => count > 0)
    const reassignmentMessages = hasReassignmentData
      ? Object.values(REASSIGNMENTS).reduce((messages, { title }, index) => {
          if (counts[index] > 0) {
            messages.push(reassignmentMessage(title, counts[index]))
          }
          return messages
        }, [])
      : ['There is no data that needs to be reassigned.']

    setModalData(prev => ({
      ...prev,
      reassignmentCounts: counts,
      reassignmentMessages,
      hasReassignmentData,
      isLoading: false,
    }))

    const modal = createModal({
      Actions: DeleteConceptActions,
      Content: DeleteConceptContent,
      Title: ConceptTitle,
      minWidth: 600,
    })

    setModal(modal)
  }, [concept.parent, concept.name, apiFns, setModal, setModalData])

  return deleteConceptModal
}

export default useDeleteConceptModal
