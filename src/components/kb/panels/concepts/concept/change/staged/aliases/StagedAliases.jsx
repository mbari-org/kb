import StagedAlias from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAlias'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedAliasesEdits } from '@/lib/concept/state/aliases'

import CONFIG from '@/text'

const StagedAliases = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT.ALIASES}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedAlias}
      stagedItems={stagedAliasesEdits(stagedEdit)}
    />
  )
}

export default StagedAliases
