import StagedAlias from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAlias'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedAliasesEdits } from '@/lib/concept/state/aliases'

import { CONFIG } from '@/config/js/index.js'

const StagedAliases = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={CONFIG.PANELS.CONCEPTS.MODALS.STAGED.CONCEPT.ALIASES}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedAlias}
      stagedItems={stagedAliasesEdits(stagedEdit)}
    />
  )
}

export default StagedAliases
