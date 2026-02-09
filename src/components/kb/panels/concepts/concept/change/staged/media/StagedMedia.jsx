import { useMemo } from 'react'

import StagedMediaItem from './StagedMediaItem'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedMediaEdits } from '@/lib/concept/state/media'

import CONFIG from '@/text'

const StagedMedia = ({ stagedEdit }) => {
  const stagedItems = useMemo(() => stagedMediaEdits(stagedEdit), [stagedEdit])

  return (
    <StagedItems
      group={CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT.MEDIA}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedMediaItem}
      stagedItems={stagedItems}
    />
  )
}

export default StagedMedia
