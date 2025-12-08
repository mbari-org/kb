import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'
import StagedRealization from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealization'

import { stagedRealizationEdits } from '@/lib/concept/state/realizations'

import { MODALS } from '@/config/js/panels/concepts/modals.js'

const StagedRealizations = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={MODALS.STAGED.CONCEPT.REALIZATIONS}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedRealization}
      stagedItems={stagedRealizationEdits(stagedEdit)}
    />
  )
}

export default StagedRealizations
