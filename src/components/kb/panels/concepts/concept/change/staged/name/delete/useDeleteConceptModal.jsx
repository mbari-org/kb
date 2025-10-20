import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import DeleteConceptContent from './DeleteConceptContent'
import DeleteConceptActions from './DeleteConceptActions'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { associatedInfo } from '../associatedData'

const useDeleteConceptModal = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const deleteConceptModal = useCallback(async () => {
    setModalData(prev => ({
      ...prev,
      alert: null,
      associatedCounts: [],
      associatedMessages: [],
      hasAssociatedData: false,
      isLoading: true,
      isValid: true,
      modified: true,
      reassignTo: concept.parent,
    }))

    const { countsByTitle, hasAssociatedData, associatedMessages } =
      await associatedInfo(apiFns, concept.name)

    setModalData(prev => ({
      ...prev,
      associatedCounts: countsByTitle,
      associatedMessages,
      hasAssociatedData,
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
