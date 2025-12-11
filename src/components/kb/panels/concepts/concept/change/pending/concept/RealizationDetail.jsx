import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import CONFIG from '@/config'

const RealizationDetail = ({ pendingRealization }) => {
  return <PendingItem group={CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT.REALIZATIONS} item={pendingRealization} />
}

export default RealizationDetail
