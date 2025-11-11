import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'
import StagedRealization from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealization'

import { stagedRealizationEdits } from '@/lib/kb/state/realizations'

import { RESETTING } from '@/lib/constants/constants'

const StagedRealizations = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={RESETTING.REALIZATIONS}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedRealization}
      stagedItems={stagedRealizationEdits(stagedEdit)}
    />
  )
}

export default StagedRealizations
