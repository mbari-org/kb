import { use } from 'react'

import TemplateForm from '@/components/kb/panels/templates/form/TemplateForm'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

const AddTemplateContent = () => {
  const { modalData, setModalData } = use(HOLDModalContext)
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
