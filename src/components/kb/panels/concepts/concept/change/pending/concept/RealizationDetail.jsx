import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import CONFIG from '@/lib/config'

const RealizationDetail = ({ pendingRealization }) => {
  return <PendingItem group={CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT.REALIZATIONS} item={pendingRealization} />
}

export default RealizationDetail
