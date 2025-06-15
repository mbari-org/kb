import { use, useCallback } from 'react'

import DeleteReferenceActions from './DeleteReferenceActions'
import DeleteReferenceContent from './DeleteReferenceContent'
import DeleteReferenceTitle from './DeleteReferenceTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const deleteReferenceModal = deleteReference => {
  const components = {
    Actions: () => <DeleteReferenceActions deleteReference={deleteReference} />,
    Content: DeleteReferenceContent,
    Title: DeleteReferenceTitle,
  }

  return createModal(components)
}

const useDeleteReferenceModal = deleteReference => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(
    reference => {
      setModal(deleteReferenceModal(deleteReference))
      setModalData({ reference })
    },
    [deleteReference, setModal, setModalData]
  )
}

export default useDeleteReferenceModal
