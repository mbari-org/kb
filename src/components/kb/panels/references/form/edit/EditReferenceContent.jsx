import { use } from 'react'

import ReferenceForm from '@/components/kb/panels/references/form/ReferenceForm'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

const EditReferenceContent = () => {
  const { modalData, setModalData } = use(HOLDModalContext)
  const { reference } = modalData

  const handleChange = (updatedReference, modified, hasSearchInput) => {
    setModalData({
      ...modalData,
      reference: updatedReference,
      modified: modified || false,
      hasSearchInput: hasSearchInput || false,
    })
  }

  return <ReferenceForm reference={reference} onChange={handleChange} isEdit={true} />
}

export default EditReferenceContent
