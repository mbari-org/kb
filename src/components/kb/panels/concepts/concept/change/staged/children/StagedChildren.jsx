import StagedChild from './StagedChild'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedChildren } from '@/lib/kb/state/children'

import { RESETTING } from '@/lib/constants'

const StagedChildren = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={RESETTING.CHILDREN}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedChild}
      stagedItems={stagedChildren(stagedEdit)}
    />
  )
}

export default StagedChildren
