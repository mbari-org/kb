import { use, useCallback } from 'react'

import PendingActions from '@/components/kb/panels/concept/change/pending/modal/PendingActions'
import PendingContent from '@/components/kb/panels/concept/change/pending/modal/PendingContent'
import PendingTitle from '@/components/kb/panels/concept/change/pending/modal/PendingTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const useDisplayPending = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    intent => {
      const modal = createModal({
        Actions: () => <PendingActions intent={intent} />,
        Content: PendingContent,
        Title: PendingTitle,
        minWidth: 600,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useDisplayPending
