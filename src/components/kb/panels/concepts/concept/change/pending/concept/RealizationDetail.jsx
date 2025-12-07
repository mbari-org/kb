import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import { PENDING } from '@/lib/kb/constants/pending.js'

const { GROUP } = PENDING

const RealizationDetail = ({ pendingRealization }) => {
  return <PendingItem group={GROUP.REALIZATIONS} item={pendingRealization} />
}

export default RealizationDetail
