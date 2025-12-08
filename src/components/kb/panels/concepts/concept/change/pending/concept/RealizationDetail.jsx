import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import group from '@/config/text/panels/concepts/modals/group.json'

const RealizationDetail = ({ pendingRealization }) => {
  return <PendingItem group={group.REALIZATIONS} item={pendingRealization} />
}

export default RealizationDetail
