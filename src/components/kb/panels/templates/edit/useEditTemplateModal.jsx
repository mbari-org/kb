import { use, useCallback } from 'react'
import EditTemplateActions from './EditTemplateActions'
import EditTemplateContent from './EditTemplateContent'
import EditTemplateTitle from './EditTemplateTitle'
import { createModal } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

const editTemplateModal = editTemplate => {
  const components = {
    Actions: () => <EditTemplateActions editTemplate={editTemplate} />,
    Content: EditTemplateContent,
    Title: EditTemplateTitle,
  }

  return createModal({ ...components, minWidth: '50vw' })
}

const useEditTemplateModal = editTemplate => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(
    template => {
      setModal(editTemplateModal(editTemplate))
      setModalData({
        template,
        originalTemplate: template,
        modified: false,
      })
    },
    [editTemplate, setModal, setModalData]
  )
}

export default useEditTemplateModal
