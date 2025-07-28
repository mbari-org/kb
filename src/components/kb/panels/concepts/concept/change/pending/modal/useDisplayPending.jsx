import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'

import PendingActions from '@/components/kb/panels/concepts/concept/change/pending/modal/PendingActions'
import PendingContent from '@/components/kb/panels/concepts/concept/change/pending/modal/PendingContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const useDisplayPending = () => {
  const { setConfirmPending } = use(ConceptContext)
  const { setModal } = use(ConceptModalContext)

  return useCallback(
    intent => {
      setConfirmPending(null)

      const modal = createModal({
        Actions: () => <PendingActions intent={intent} />,
        Content: PendingContent,
        Title: () => <ConceptTitle />,
        minWidth: 625,
      })
      setModal(modal)
    },
    [setConfirmPending, setModal]
  )
}

export default useDisplayPending
