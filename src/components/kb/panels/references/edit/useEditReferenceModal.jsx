import { use, useCallback } from 'react'

import EditReferenceActions from './EditReferenceActions'
import EditReferenceContent from './EditReferenceContent'
import EditReferenceTitle from './EditReferenceTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'
import ReferencesContext from '@/contexts/references/ReferencesContext'

const editReferenceModal = editReference => {
  const components = {
    Actions: () => <EditReferenceActions editReference={editReference} />,
    Content: () => <EditReferenceContent />,
    Title: EditReferenceTitle,
  }

  return createModal({ ...components, minWidth: '75vw' })
}

const useEditReferenceModal = editReference => {
  const { setModal, setModalData } = use(ModalContext)
  const { isDoiUnique } = use(ReferencesContext)

  return useCallback(
    reference => {
      setModal(editReferenceModal(editReference, isDoiUnique))
      setModalData({
        reference,
        originalReference: reference,
        modified: false,
      })
    },
    [editReference, isDoiUnique, setModal, setModalData]
  )
}

export default useEditReferenceModal
