import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'
import StagedRealization from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealization'

import { stagedRealizations } from '@/lib/kb/state/realizations'

import { RESETTING } from '@/lib/constants'

const StagedRealizations = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={RESETTING.REALIZATIONS}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedRealization}
      stagedItems={stagedRealizations(stagedEdit)}
    />
  )
}

export default StagedRealizations
