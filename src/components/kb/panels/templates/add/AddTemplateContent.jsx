import { use } from 'react'
import ModalContext from '@/contexts/modal/ModalContext'
import TemplateForm from '../form/TemplateForm'

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
