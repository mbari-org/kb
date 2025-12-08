import StagedMediaItem from './StagedMediaItem'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedMediaEdits } from '@/lib/concept/state/media'

import { MODALS } from '@/config/js/panels/concepts/modals.js'

const StagedMedia = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={MODALS.STAGED.CONCEPT.MEDIA}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedMediaItem}
      stagedItems={stagedMediaEdits(stagedEdit)}
    />
  )
}

export default StagedMedia
