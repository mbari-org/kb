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

  return useCallback(() => {
    setModalData(prev => ({
      ...prev,
      reassignTo: concept.parent,
      modified: true,
      isValid: true,
      alert: null,
    }))

    const modal = createModal({
      Actions: DeleteConceptActions,
      Content: DeleteConceptContent,
      Title: ConceptTitle,
      minWidth: 600,
    })

    setModal(modal)
  }, [concept.parent, setModal, setModalData])
}

export default useDeleteConceptModal
