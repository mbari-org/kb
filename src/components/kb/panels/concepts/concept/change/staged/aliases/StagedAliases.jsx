import StagedAlias from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAlias'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedAliasesEdits } from '@/lib/concept/state/aliases'

import { MODALS } from '@/config/js/panels/concepts/modals.js'

const StagedAliases = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={MODALS.STAGED.CONCEPT.ALIASES}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedAlias}
      stagedItems={stagedAliasesEdits(stagedEdit)}
    />
  )
}

export default StagedAliases
