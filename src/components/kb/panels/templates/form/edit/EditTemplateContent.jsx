import { use } from 'react'

import TemplateForm from '@/components/kb/panels/templates/form/TemplateForm'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const EditTemplateContent = () => {
  const { modalData, setModalData } = use(PanelModalContext)
  const { template } = modalData

  const handleChange = (updatedTemplate, isModified, hasSearchInput) => {
    setModalData({
      ...modalData,
      template: updatedTemplate,
      modified: isModified,
      hasSearchInput,
    })
  }

  return <TemplateForm template={template} onChange={handleChange} isEdit />
}

export default EditTemplateContent
