import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import group from '@/config/text/panels/concepts/modals/group.json'

const TemplateDetail = ({ pendingTemplate }) => {
  return <PendingItem group={group.TEMPLATES} item={pendingTemplate} />
}

export default TemplateDetail
