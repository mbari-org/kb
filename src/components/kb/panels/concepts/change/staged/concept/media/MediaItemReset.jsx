import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ResettingButton from '@/components/kb/panels/concepts/change/ResettingButton'

import {
  mediaResetting,
  isStagedAction,
} from '@/components/kb/panels/concepts/change/staged/concept/util'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const MediaItemReset = ({ index }) => {
  const { confirmReset, modifyConcept, stagedState } = use(ConceptContext)

  const resetting = mediaResetting(confirmReset, index) === RESETTING.ME

  const onClick = () => {
    // Check if this is the only media item edit left, and if so, do RESET.MEDIA
    const count = stagedState.media.filter(item => isStagedAction(item.action)).length
    count === 1
      ? modifyConcept({ type: CONCEPT_STATE.RESET.MEDIA })
      : modifyConcept({
          type: CONCEPT_STATE.RESET.MEDIA_ITEM,
          update: { index },
        })
  }

  return (
    <ResettingButton
      color='cancel'
      disabled={confirmReset}
      onClick={onClick}
      resetting={resetting}
    />
  )
}

export default MediaItemReset
