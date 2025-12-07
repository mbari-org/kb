import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingMedia } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

const { RESET } = CONCEPT_STATE

const MediaReset = () => {
  return (
    <StagedReset
      resettingFunction={resettingMedia}
      group='media'
      resetGroupType={RESET.MEDIA}
      resetItemType={RESET.MEDIA}
    />
  )
}

export default MediaReset
