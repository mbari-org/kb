import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import CONFIG from '@/lib/config'

const MediaItemDetail = ({ pendingMediaItem }) => {
  return <PendingItem group={CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT.MEDIA} item={pendingMediaItem} />
}

export default MediaItemDetail
