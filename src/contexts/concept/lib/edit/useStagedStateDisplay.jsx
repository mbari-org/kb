import { use, useCallback } from 'react'

import StagedStateActions from '@/components/kb/panels/concept/stagedState/StagedStateActions'
import StagedStateContent from '@/components/kb/panels/concept/stagedState/StagedStateContent'
import StagedStateTitle from '@/components/kb/panels/concept/stagedState/StagedStateTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const useStagedStateDisplay = () => {
  const { setModal } = use(ModalContext)

  return useCallback(
    intent => {
      const modal = createModal({
        Actions: () => <StagedStateActions intent={intent} />,
        Content: StagedStateContent,
        Title: StagedStateTitle,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useStagedStateDisplay
