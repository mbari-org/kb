import DescriptionDetail from '@/components/common/DescriptionDetail'

import { pick } from '@/lib/util'

const DisplayPending = ({ pending }) => {
  const description = pending.action
  const displayValues = pick(pending, [
    ['oldValue', 'before'],
    ['newValue', 'after'],
    ['creatorName', 'user'],
    ['creationTimestamp', 'created'],
  ])

  return <DescriptionDetail description={description} detail={displayValues} />
}

export default DisplayPending
