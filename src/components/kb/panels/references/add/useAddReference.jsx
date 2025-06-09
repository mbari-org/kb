import { use, useCallback } from 'react'

import AddReferenceActions from './AddReferenceActions'
import AddReferenceContent from './AddReferenceContent'
import AddReferenceTitle from './AddReferenceTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const addReferenceModal = addReference => {
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
  const { getSelected } = use(SelectedContext)

  const selectedConcept = getSelected('concept')
  const byConcept = getSelected('byConcept')

  return useCallback(() => {
    setModal(addReferenceModal(addReference))
    setModalData({ ...initialReferenceData })
  }, [addReference, setModal, setModalData])
}

export default useAddReferenceModal
