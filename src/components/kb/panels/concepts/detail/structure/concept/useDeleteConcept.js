import { use, useCallback } from 'react'

import DeleteConceptActions from './DeleteConceptActions'
import DeleteConceptContent from './DeleteConceptContent'
import DeleteConceptTitle from './DeleteConceptTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const deleteConceptModal = () => {
  const components = {
    Actions: DeleteConceptActions,
    Content: DeleteConceptContent,
    Title: DeleteConceptTitle,
  }

  return createModal(components)
}

const useDeleteConcept = closeChoices => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    closeChoices()

    const modal = deleteConceptModal()
    setModal(modal)
  }, [closeChoices, setModal])
}

export default useDeleteConcept
