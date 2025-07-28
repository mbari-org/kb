import StagedMediaItem from './StagedMediaItem'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedMedia } from '@/lib/kb/state/media'

import { RESETTING } from '@/lib/constants'

const StagedMedia = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={RESETTING.MEDIA}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedMediaItem}
      stagedItems={stagedMedia(stagedEdit)}
    />
  )
}

export default StagedMedia
