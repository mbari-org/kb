import { use, useCallback } from 'react'
import DeleteTemplateActions from './DeleteTemplateActions'
import DeleteTemplateContent from './DeleteTemplateContent'
import DeleteTemplateTitle from './DeleteTemplateTitle'
import { createModal } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

const deleteTemplateModal = deleteTemplate => {
  const components = {
    Actions: () => <DeleteTemplateActions deleteTemplate={deleteTemplate} />,
    Content: DeleteTemplateContent,
    Title: DeleteTemplateTitle,
  }

  return createModal(components)
}

const useDeleteTemplateModal = deleteTemplate => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(
    template => {
      setModal(deleteTemplateModal(deleteTemplate))
      setModalData({ template })
    },
    [deleteTemplate, setModal, setModalData]
  )
}

export default useDeleteTemplateModal
