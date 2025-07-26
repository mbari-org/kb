import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import DeleteConceptActions from './DeleteConceptActions'
import DeleteConceptContent from './DeleteConceptContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const deleteConceptModal = () => {
  const components = {
    Actions: DeleteConceptActions,
    Content: DeleteConceptContent,
    Title: ConceptTitle,
  }

  return createModal(components)
}

const useDeleteConceptModal = () => {
  const { setModal } = use(ConceptModalContext)

  return useCallback(() => {
    const modal = deleteConceptModal()
    setModal(modal)
  }, [setModal])
}

export default useDeleteConceptModal
