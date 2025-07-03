import { use, useCallback } from 'react'

import DeleteConceptActions from './DeleteConceptActions'
import DeleteConceptContent from './DeleteConceptContent'
import DeleteConceptTitle from './DeleteConceptTitle'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const deleteConceptModal = () => {
  const components = {
    Actions: DeleteConceptActions,
    Content: DeleteConceptContent,
    Title: DeleteConceptTitle,
  }

  return createModal(components)
}

const useDeleteConcept = closeChoices => {
  const { setModal } = use(ConceptModalContext)

  return useCallback(() => {
    closeChoices()

    const modal = deleteConceptModal()
    setModal(modal)
  }, [closeChoices, setModal])
}

export default useDeleteConcept
