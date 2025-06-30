import { use, useCallback } from 'react'

import AddReferenceActions from './AddReferenceActions'
import AddReferenceContent from './AddReferenceContent'
import AddReferenceTitle from './AddReferenceTitle'

import { createModal } from '@/components/modal/panelModalFactory'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const addReferenceModal = addReference => {
  const components = {
    Actions: () => <AddReferenceActions addReference={addReference} />,
    Content: () => <AddReferenceContent />,
    Title: AddReferenceTitle,
  }

  return createModal({ ...components, minWidth: '75vw' })
}

const initialReferenceData = {
  action: 'add',
  modified: false,
  reference: {
    citation: '',
    doi: '',
    concepts: [],
  },
}

const useAddReferenceModal = addReference => {
  const { setModal, setModalData } = use(PanelModalContext)

  return useCallback(() => {
    setModal(addReferenceModal(addReference))
    setModalData({ ...initialReferenceData })
  }, [addReference, setModal, setModalData])
}

export default useAddReferenceModal
