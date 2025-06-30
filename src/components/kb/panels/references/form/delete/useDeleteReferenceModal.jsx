import { use, useCallback } from 'react'

import DeleteReferenceActions from './DeleteReferenceActions'
import DeleteReferenceContent from './DeleteReferenceContent'
import DeleteReferenceTitle from './DeleteReferenceTitle'

import { createModal } from '@/components/modal/panelModalFactory'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const deleteReferenceModal = deleteReference => {
  const components = {
    Actions: () => <DeleteReferenceActions deleteReference={deleteReference} />,
    Content: DeleteReferenceContent,
    Title: DeleteReferenceTitle,
  }

  return createModal(components)
}

const useDeleteReferenceModal = deleteReference => {
  const { setModal, setModalData } = use(PanelModalContext)

  return useCallback(
    reference => {
      setModal(deleteReferenceModal(deleteReference))
      setModalData({ reference })
    },
    [deleteReference, setModal, setModalData]
  )
}

export default useDeleteReferenceModal
