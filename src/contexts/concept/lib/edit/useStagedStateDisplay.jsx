import { use, useCallback } from 'react'

import StagedStateActions from '@/components/kb/panels/concepts/stagedState/StagedStateActions'
import StagedStateContent from '@/components/kb/panels/concepts/stagedState/StagedStateContent'
import StagedStateTitle from '@/components/kb/panels/concepts/stagedState/StagedStateTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

export const INTENT = {
  DISCARD: 'Discard',
  SAVE: 'Save',
  SHOW: 'Staged',
}

const useStagedStateDisplay = intent => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: () => <StagedStateActions intent={intent} />,
      Content: StagedStateContent,
      Title: StagedStateTitle,
    })
    setModal(modal)
  }, [intent, setModal])
}

export default useStagedStateDisplay
