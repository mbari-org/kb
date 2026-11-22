import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import SaveOutcomeUnknownActions from '@/components/kb/panels/concepts/concept/change/staged/modal/SaveOutcomeUnknownActions'
import SaveOutcomeUnknownContent from '@/components/kb/panels/concepts/concept/change/staged/modal/SaveOutcomeUnknownContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const refuseClose = () => false

const useDisplaySaveOutcomeUnknown = () => {
  const { setModal } = use(ConceptModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: SaveOutcomeUnknownActions,
      Content: SaveOutcomeUnknownContent,
      Title: ConceptTitle,
      minWidth: 600,
    })
    setModal(modal, refuseClose)
  }, [setModal])
}

export default useDisplaySaveOutcomeUnknown
