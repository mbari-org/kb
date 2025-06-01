import { use, useCallback } from 'react'

import EditReferenceActions from './EditReferenceActions'
import EditReferenceContent from './EditReferenceContent'
import EditReferenceTitle from './EditReferenceTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const editReferenceModal = (editReference, references) => {
  const isDoiUnique = (doi, currentId) => {
    if (!doi) return true
    return !references.some(
      ref => ref.id !== currentId && ref.doi?.toLowerCase() === doi.toLowerCase()
    )
  }

  const components = {
    Actions: () => <EditReferenceActions editReference={editReference} isDoiUnique={isDoiUnique} />,
    Content: () => <EditReferenceContent isDoiUnique={isDoiUnique} />,
    Title: EditReferenceTitle,
  }

  return createModal(components)
}

const useEditReferenceModal = (editReference, references) => {
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(
    reference => {
      setModal(editReferenceModal(editReference, references))
      setModalData({
        reference: {
          ...reference,
          originalReference: reference,
        },
        modified: false,
      })
    },
    [editReference, references, setModal, setModalData]
  )
}

export default useEditReferenceModal
