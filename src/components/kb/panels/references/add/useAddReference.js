import { use, useCallback } from 'react'

import AddReferenceActions from './AddReferenceActions'
import AddReferenceContent from './AddReferenceContent'
import AddReferenceTitle from './AddReferenceTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const addReferenceModal = () => {
  const components = {
    Actions: AddReferenceActions,
    Content: AddReferenceContent,
    Title: AddReferenceTitle,
  }

  return createModal(components)
}

const initialReferenceData = {
  reference: {
    citation: '',
    doi: '',
  },
  modified: false,
}

const useAddReference = onAddReference => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(() => {
    setModal(addReferenceModal())
    setModalData({ ...initialReferenceData, onAddReference })
  }, [setModal, setModalData, onAddReference])
}

export default useAddReference
