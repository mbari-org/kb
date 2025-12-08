import StagedChild from './StagedChild'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedChildren } from '@/lib/concept/state/children'

import { CONFIG } from '@/config/js/index.js'

const StagedChildren = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={CONFIG.PANELS.CONCEPTS.MODALS.STAGED.CONCEPT.CHILDREN}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedChild}
      stagedItems={stagedChildren(stagedEdit)}
    />
  )
}

export default StagedChildren
