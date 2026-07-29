import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import CONFIG from '@/lib/config'

const AliasDetail = ({ pendingAlias }) => {
  return <PendingItem group={CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT.ALIASES} item={pendingAlias} />
}

export default AliasDetail
