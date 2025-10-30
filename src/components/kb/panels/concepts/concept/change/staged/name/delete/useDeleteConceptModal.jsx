import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import DeleteConceptContent from './DeleteConceptContent'
import DeleteConceptActions from './DeleteConceptActions'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const useDeleteConceptModal = () => {
  const { concept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const deleteConceptModal = useCallback(() => {
    setModalData(prev => ({
      ...prev,
      alert: null,
      associatedCounts: null,
      associatedMessages: {},
      isLoading: true,
      isValid: true,
      modified: true,
      reassignTo: concept.parent,
    }))

    const modal = createModal({
      Actions: DeleteConceptActions,
      Content: DeleteConceptContent,
      Title: ConceptTitle,
      minWidth: 600,
    })

    setModal(modal)
  }, [concept.parent, setModal, setModalData])

  return deleteConceptModal
}

export default useDeleteConceptModal
