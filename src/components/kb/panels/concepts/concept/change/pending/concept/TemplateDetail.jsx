import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import { PENDING } from '@/lib/kb/constants/pending.js'

const { GROUP } = PENDING

const TemplateDetail = ({ pendingTemplate }) => {
  return <PendingItem group={GROUP.TEMPLATES} item={pendingTemplate} />
}

export default TemplateDetail
