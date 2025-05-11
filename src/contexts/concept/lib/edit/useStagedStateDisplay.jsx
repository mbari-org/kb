import { use, useCallback } from 'react'

import StagedActions from '@/components/kb/panels/concept/change/staged/modal/StagedActions'
import StagedStateContent from '@/components/kb/panels/concept/change/staged/modal/StagedContent'
import StagedStateTitle from '@/components/kb/panels/concept/change/staged/modal/StagedTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const useStagedStateDisplay = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    intent => {
      const modal = createModal({
        Actions: () => <StagedActions intent={intent} />,
        Content: StagedStateContent,
        Title: StagedStateTitle,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useStagedStateDisplay
