import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import { PENDING } from '@/lib/constants'

const { GROUP } = PENDING

const AliasDetail = ({ pendingAlias }) => {
  return <PendingItem group={GROUP.ALIASES} item={pendingAlias} />
}

export default AliasDetail
