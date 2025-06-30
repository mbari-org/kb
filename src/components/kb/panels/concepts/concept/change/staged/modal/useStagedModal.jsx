import { use, useCallback } from 'react'

import StagedActions from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedActions'
import StagedStateContent from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedContent'
import StagedStateTitle from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedTitle'

import { createModal } from '@/components/modal/factory'

import ConceptModalContext from '@/contexts/modal/ConceptModalContext'

const useStagedModal = () => {
  const { setModal } = use(ConceptModalContext)

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

export default useStagedModal
