import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import group from '@/config/text/panels/concepts/modals/group.json'

const AliasDetail = ({ pendingAlias }) => {
  return <PendingItem group={group.ALIASES} item={pendingAlias} />
}

export default AliasDetail
