import { use, useCallback } from 'react'

import AddReferenceActions from './AddReferenceActions'
import AddReferenceContent from './AddReferenceContent'
import AddReferenceTitle from './AddReferenceTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'
import ReferencesContext from '@/contexts/references/ReferencesContext'

const addReferenceModal = (addReference, isDoiUnique) => {
  const components = {
    Actions: () => <AddReferenceActions addReference={addReference} />,
    Content: () => <AddReferenceContent />,
    Title: AddReferenceTitle,
  }

  return createModal({ ...components, minWidth: '75vw' })
}

const initialReferenceData = {
  reference: {
    citation: '',
    doi: '',
    concepts: [],
  },
  modified: false,
}

const useAddReferenceModal = addReference => {
  const { setModal, setModalData } = use(ModalContext)
  const { isDoiUnique } = use(ReferencesContext)

  return useCallback(() => {
    setModal(addReferenceModal(addReference, isDoiUnique))
    setModalData({ ...initialReferenceData })
  }, [addReference, isDoiUnique, setModal, setModalData])
}

export default useAddReferenceModal
