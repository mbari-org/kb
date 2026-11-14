import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import { ACTION, CONCEPT } from '@/lib/constants'

const ChildDetail = ({ pendingChild }) => {
  const infoRows = pendingChild.action === ACTION.ADD
    ? [[CONCEPT.FIELD.PARENT, pendingChild.concept]]
    : pendingChild.parent ? [[CONCEPT.FIELD.PARENT, pendingChild.parent]] : []

  return <PendingItem infoRows={infoRows} item={pendingChild} />
}

export default ChildDetail
