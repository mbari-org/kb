import { use, useCallback } from 'react'

import StagedActions from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedActions'
import StagedContent from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedContent'
import StagedTitle from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedTitle'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const useDisplayStaged = () => {
  const { setModal } = use(ConceptModalContext)

  return useCallback(
    intent => {
      const modal = createModal({
        Actions: () => <StagedActions intent={intent} />,
        Content: StagedContent,
        Title: StagedTitle,
        minWidth: 600,
      })
      setModal(modal)
    },
    [setModal]
  )
}

export default useDisplayStaged
