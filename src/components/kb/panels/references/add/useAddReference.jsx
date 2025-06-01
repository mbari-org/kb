import { use, useCallback } from 'react'

import AddReferenceActions from './AddReferenceActions'
import AddReferenceContent from './AddReferenceContent'
import AddReferenceTitle from './AddReferenceTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const addReferenceModal = (addReference, references) => {
  const isDoiUnique = doi => {
    if (!doi) return true
    return !references.some(ref => ref.doi?.toLowerCase() === doi.toLowerCase())
  }

  const components = {
    Actions: () => <AddReferenceActions addReference={addReference} isDoiUnique={isDoiUnique} />,
    Content: () => <AddReferenceContent isDoiUnique={isDoiUnique} />,
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

const useAddReferenceModal = (addReference, references) => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(() => {
    setModal(addReferenceModal(addReference, references))
    setModalData({ ...initialReferenceData })
  }, [addReference, references, setModal, setModalData])
}

export default useAddReferenceModal
