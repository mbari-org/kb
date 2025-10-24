import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import DeleteConceptContent from './DeleteConceptContent'
import DeleteConceptActions from './DeleteConceptActions'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { associatedInfo } from '../associatedData'

const useDeleteConceptModal = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)
  const { getReferences } = use(PanelDataContext)

  const deleteConceptModal = useCallback(async () => {
    setModalData(prev => ({
      ...prev,
      alert: null,
      associatedCounts: [],
      associatedMessages: [],
      hasReassignmentData: false,
      hasReferencesData: false,
      isLoading: true,
      isValid: true,
      modified: true,
      reassignTo: concept.parent,
    }))

    const { associatedCounts, hasReassignmentData, hasReferencesData, associatedMessages } =
      await associatedInfo(apiFns, concept.name, getReferences)

    setModalData(prev => ({
      ...prev,
      associatedCounts,
      associatedMessages,
      hasReassignmentData,
      hasReferencesData,
      isLoading: false,
    }))

    const modal = createModal({
      Actions: DeleteConceptActions,
      Content: DeleteConceptContent,
      Title: ConceptTitle,
      minWidth: 600,
    })

    setModal(modal)
  }, [concept.parent, concept.name, apiFns, setModal, setModalData, getReferences])

  return deleteConceptModal
}

export default useDeleteConceptModal
