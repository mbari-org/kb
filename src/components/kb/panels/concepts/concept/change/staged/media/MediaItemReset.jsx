import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingMedia } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { RESET } = CONCEPT_STATE

const MediaItemReset = ({ index }) => {
  return (
    <StagedReset
      index={index}
      resettingFunction={resettingMedia}
      group={CONCEPT.FIELD.MEDIA}
      resetGroupType={RESET.MEDIA}
      resetItemType={RESET.MEDIA}
    />
  )
}

export default MediaItemReset
