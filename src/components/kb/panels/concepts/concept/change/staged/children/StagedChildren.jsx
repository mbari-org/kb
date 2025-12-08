import StagedChild from './StagedChild'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedChildren } from '@/lib/concept/state/children'

import { UI_TEXT } from '@/lib/constants/uiText.js'

const StagedChildren = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={UI_TEXT.RESETTING.CHILDREN}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedChild}
      stagedItems={stagedChildren(stagedEdit)}
    />
  )
}

export default StagedChildren
