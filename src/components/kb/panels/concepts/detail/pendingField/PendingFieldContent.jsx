import { use } from 'react'

import DescriptionDetail from '@/components/common/DescriptionDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { pickFields } from '@/lib/util'
import { getFieldPendingHistory } from '@/lib/kb/util/pendingHistory'

const PendingFieldContent = ({ field }) => {
  const { pendingHistory } = use(ConceptContext)
  const pendingFieldHistory = getFieldPendingHistory(pendingHistory, field)

  const displayValues = pickFields(pendingFieldHistory, [
    'action',
    ['oldValue', 'before'],
    ['newValue', 'after'],
    ['creatorName', 'user'],
    ['creationTimestamp', 'created'],
  ])

  return <DescriptionDetail description={field} detail={displayValues} />
}

export default PendingFieldContent
