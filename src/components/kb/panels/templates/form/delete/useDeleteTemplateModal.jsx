import { use, useCallback } from 'react'
import DeleteTemplateActions from './DeleteTemplateActions'
import DeleteTemplateContent from './DeleteTemplateContent'
import DeleteTemplateTitle from './DeleteTemplateTitle'
import { createModal } from '@/components/modal/panelModalFactory'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const deleteTemplateModal = deleteTemplate => {
  const components = {
    Actions: () => <DeleteTemplateActions deleteTemplate={deleteTemplate} />,
    Content: DeleteTemplateContent,
    Title: DeleteTemplateTitle,
  }

  return createModal(components)
}

const useDeleteTemplateModal = deleteTemplate => {
  const { setModal, setModalData } = use(PanelModalContext)

  return useCallback(
    template => {
      setModal(deleteTemplateModal(deleteTemplate))
      setModalData({ template })
    },
    [deleteTemplate, setModal, setModalData]
  )
}

export default useDeleteTemplateModal
