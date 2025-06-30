import { use, useCallback } from 'react'
import EditTemplateActions from './EditTemplateActions'
import EditTemplateContent from './EditTemplateContent'
import EditTemplateTitle from './EditTemplateTitle'
import { createModal } from '@/components/modal/panelModalFactory'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const editTemplateModal = editTemplate => {
  const components = {
    Actions: () => <EditTemplateActions editTemplate={editTemplate} />,
    Content: EditTemplateContent,
    Title: EditTemplateTitle,
  }

  return createModal({ ...components, minWidth: '50vw' })
}

const useEditTemplateModal = editTemplate => {
  const { setModal, setModalData } = use(PanelModalContext)

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
