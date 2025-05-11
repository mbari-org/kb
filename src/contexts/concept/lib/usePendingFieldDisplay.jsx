import { use, useCallback } from 'react'

import { createModal } from '@/components/modal/factory'
import PendingFieldActions from '@/components/kb/panels/concept/change/staged/field/pending/PendingFieldActions'
import PendingFieldContent from '@/components/kb/panels/concept/change/staged/field/pending/PendingFieldContent'
import PendingFieldTitle from '@/components/kb/panels/concept/change/staged/field/pending/PendingFieldTitle'

import ModalContext from '@/contexts/modal/ModalContext'

const usePendingFieldDisplay = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    field => {
      const modal = createModal({
        Actions: () => <PendingFieldActions field={field} />,
        Content: () => <PendingFieldContent field={field} />,
        Title: PendingFieldTitle,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default usePendingFieldDisplay
