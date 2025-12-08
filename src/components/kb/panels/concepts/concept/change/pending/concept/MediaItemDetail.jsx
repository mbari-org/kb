import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import group from '@/config/text/panels/concepts/modals/group.json'

const MediaItemDetail = ({ pendingMediaItem }) => {
  return <PendingItem group={group.MEDIA} item={pendingMediaItem} />
}

export default MediaItemDetail
