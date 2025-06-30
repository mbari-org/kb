import { use, useCallback } from 'react'

import EditReferenceActions from './EditReferenceActions'
import EditReferenceContent from './EditReferenceContent'
import EditReferenceTitle from './EditReferenceTitle'

import { createModal } from '@/components/modal/factory'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import KBDataContext from '@/contexts/kbData/KBDataContext' // eslint-disable-line no-unused-vars

const editReferenceModal = editReference => {
  const components = {
    Actions: () => <EditReferenceActions editReference={editReference} />,
    Content: () => <EditReferenceContent />,
    Title: EditReferenceTitle,
  }

  return createModal({ ...components, minWidth: '75vw' })
}

const useEditReferenceModal = editReference => {
  const { setModal, setModalData } = use(PanelModalContext)
  // isDoiUnique is now available via KBDataContext in the content/actions

  return useCallback(
    reference => {
      setModal(editReferenceModal(editReference))
      setModalData({
        action: 'edit',
        modified: false,
        originalReference: reference,
        reference,
      })
    },
    [editReference, setModal, setModalData]
  )
}

export default useEditReferenceModal
