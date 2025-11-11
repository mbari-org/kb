import StagedAlias from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAlias'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedAliasesEdits } from '@/lib/kb/state/aliases'

import { UI_TEXT } from '@/lib/constants/uiText.js'

const StagedAliases = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={UI_TEXT.RESETTING.ALIASES}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedAlias}
      stagedItems={stagedAliasesEdits(stagedEdit)}
    />
  )
}

export default StagedAliases
