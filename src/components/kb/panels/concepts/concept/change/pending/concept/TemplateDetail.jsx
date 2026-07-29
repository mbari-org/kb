import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import CONFIG from '@/lib/config'

const TemplateDetail = ({ pendingTemplate }) => {
  return <PendingItem group={CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT.TEMPLATES} item={pendingTemplate} />
}

export default TemplateDetail
