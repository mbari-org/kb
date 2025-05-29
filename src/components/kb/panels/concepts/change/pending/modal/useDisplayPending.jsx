import { use, useCallback } from 'react'

import PendingActions from '@/components/kb/panels/concepts/change/pending/modal/PendingActions'
import PendingContent from '@/components/kb/panels/concepts/change/pending/modal/PendingContent'
import PendingTitle from '@/components/kb/panels/concepts/change/pending/modal/PendingTitle'

import { createModal } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

const useDisplayPending = () => {
  const { setConfirmPending } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  return useCallback(
    intent => {
      setConfirmPending(null)

      const modal = createModal({
        Actions: () => <PendingActions intent={intent} />,
        Content: PendingContent,
        Title: PendingTitle,
        minWidth: 625,
      })
      setModal(modal)
    },
    [setConfirmPending, setModal]
  )
}

export default useDisplayPending
