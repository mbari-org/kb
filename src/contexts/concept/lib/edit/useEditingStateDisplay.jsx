import { use, useCallback } from 'react'

import EditingStateActions from '@/components/kb/panels/concepts/editingState/EditingStateActions'
import EditingStateContent from '@/components/kb/panels/concepts/editingState/EditingStateContent'
import EditingStateTitle from '@/components/kb/panels/concepts/editingState/EditingStateTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

export const INTENT = {
  SAVE: 'Save',
  SHOW: 'Show',
}

const useEditingStateDisplay = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    intent => {
      const modal = createModal({
        Actions: () => <EditingStateActions intent={intent} />,
        Content: EditingStateContent,
        Title: EditingStateTitle,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useEditingStateDisplay
