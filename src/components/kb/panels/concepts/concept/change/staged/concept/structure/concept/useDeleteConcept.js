import { use, useCallback } from 'react'

import DeleteConceptActions from './DeleteConceptActions'
import DeleteConceptContent from './DeleteConceptContent'
import DeleteConceptTitle from './DeleteConceptTitle'

import { createModal } from '@/components/modal/panelModalFactory'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

const deleteConceptModal = () => {
  const components = {
    Actions: DeleteConceptActions,
    Content: DeleteConceptContent,
    Title: DeleteConceptTitle,
  }

  return createModal(components)
}

const useDeleteConcept = closeChoices => {
  const { setModal } = use(HOLDModalContext)

  return useCallback(() => {
    closeChoices()

    const modal = deleteConceptModal()
    setModal(modal)
  }, [closeChoices, setModal])
}

export default useDeleteConcept
