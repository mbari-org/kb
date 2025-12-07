import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'
import StagedRealization from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealization'

import { stagedRealizationEdits } from '@/lib/kb/state/realizations'

import { UI_TEXT } from '@/lib/kb/constants/uiText.js'

const StagedRealizations = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={UI_TEXT.RESETTING.REALIZATIONS}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedRealization}
      stagedItems={stagedRealizationEdits(stagedEdit)}
    />
  )
}

export default StagedRealizations
