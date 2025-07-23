import StagedAlias from './StagedAlias'
import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { stagedAliases } from '@/lib/kb/model/alias'

import { RESETTING } from '@/lib/constants'

const StagedAliases = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={RESETTING.GROUP.ALIASES}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedAlias}
      stagedItems={stagedAliases(stagedEdit)}
    />
  )
}

export default StagedAliases
