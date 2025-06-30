import { use, useCallback } from 'react'
import AddTemplateActions from './AddTemplateActions'
import AddTemplateContent from './AddTemplateContent'
import AddTemplateTitle from './AddTemplateTitle'
import { createModal } from '@/components/modal/factory'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const addTemplateModal = addTemplate => {
  const components = {
    Actions: () => <AddTemplateActions addTemplate={addTemplate} />,
    Content: AddTemplateContent,
    Title: AddTemplateTitle,
  }

  return createModal({ ...components, minWidth: '50vw' })
}

const initialTemplateData = {
  template: {
    concept: '',
    linkName: '',
    toConcept: '',
    linkValue: '',
  },
  modified: false,
}

const useAddTemplateModal = addTemplate => {
  const { setModal, setModalData } = use(PanelModalContext)

  return useCallback(() => {
    setModal(addTemplateModal(addTemplate))
    setModalData({ ...initialTemplateData })
  }, [addTemplate, setModal, setModalData])
}

export default useAddTemplateModal
