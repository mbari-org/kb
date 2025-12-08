import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import { PENDING } from '@/constants/pending.js'

const { GROUP } = PENDING

const MediaItemDetail = ({ pendingMediaItem }) => {
  return <PendingItem group={GROUP.MEDIA} item={pendingMediaItem} />
}

export default MediaItemDetail
