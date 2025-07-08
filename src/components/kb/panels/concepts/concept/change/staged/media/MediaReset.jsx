import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { mediaResetting } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const MediaReset = () => {
  return (
    <StagedReset
      resettingFunction={mediaResetting}
      collectionKey='media'
      resetAllType={RESET.MEDIA}
      resetItemType={RESET.MEDIA_ITEM}
    />
  )
}

export default MediaReset
