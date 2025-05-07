import { use } from 'react'

import DescriptionDetail from '@/components/common/DescriptionDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { pick } from '@/lib/util'
import { fieldPendingHistory } from '@/lib/kb/model/history'

const PendingFieldContent = ({ field }) => {
  const { pendingHistory } = use(ConceptContext)
  const pendingFieldHistory = fieldPendingHistory(pendingHistory, field).pop()

  const displayValues = pick(pendingFieldHistory, [
    'action',
    ['oldValue', 'before'],
    ['newValue', 'after'],
    ['creatorName', 'user'],
    ['creationTimestamp', 'created'],
  ])

  return <DescriptionDetail description={field} detail={displayValues} />
}

export default PendingFieldContent
