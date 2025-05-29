import { use, useCallback } from 'react'

import StagedActions from '@/components/kb/panels/concepts/change/staged/modal/StagedActions'
import StagedStateContent from '@/components/kb/panels/concepts/change/staged/modal/StagedContent'
import StagedStateTitle from '@/components/kb/panels/concepts/change/staged/modal/StagedTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const useDisplayStaged = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    intent => {
      const modal = createModal({
        Actions: () => <StagedActions intent={intent} />,
        Content: StagedStateContent,
        Title: StagedStateTitle,
        minWidth: 600,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useDisplayStaged
