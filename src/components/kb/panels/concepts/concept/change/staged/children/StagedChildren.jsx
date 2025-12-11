import StagedChild from './StagedChild'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedChildren } from '@/lib/concept/state/children'

import { MODALS } from '@/config/js/panels/concepts/modals.js'

const StagedChildren = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={MODALS.CONCEPT.CHILDREN}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedChild}
      stagedItems={stagedChildren(stagedEdit)}
    />
  )
}

export default StagedChildren
