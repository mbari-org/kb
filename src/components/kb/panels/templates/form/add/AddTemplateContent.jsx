import { use } from 'react'

import TemplateForm from '@/components/kb/panels/templates/form/TemplateForm'

import ModalContext from '@/contexts/modal/ModalContext'

const AddTemplateContent = () => {
  const { modalData, setModalData } = use(ModalContext)
  const { template } = modalData

  const handleChange = (updatedTemplate, isModified, hasSearchInput) => {
    setModalData({
      ...modalData,
      template: updatedTemplate,
      modified: isModified,
      hasSearchInput,
    })
  }

  return <TemplateForm template={template} onChange={handleChange} />
}

export default AddTemplateContent
