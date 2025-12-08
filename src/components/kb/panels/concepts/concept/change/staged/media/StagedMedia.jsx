import StagedMediaItem from './StagedMediaItem'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedMediaEdits } from '@/lib/concept/state/media'

import { UI_TEXT } from '@/lib/constants/uiText.js'

const StagedMedia = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={UI_TEXT.RESETTING.MEDIA}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedMediaItem}
      stagedItems={stagedMediaEdits(stagedEdit)}
    />
  )
}

export default StagedMedia
