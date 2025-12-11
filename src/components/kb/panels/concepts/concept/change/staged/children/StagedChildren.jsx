import StagedChild from './StagedChild'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedChildren } from '@/lib/concept/state/children'

import CONFIG from '@/text'

const StagedChildren = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT.CHILDREN}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedChild}
      stagedItems={stagedChildren(stagedEdit)}
    />
  )
}

export default StagedChildren
