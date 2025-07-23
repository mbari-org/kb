import StagedAlias from './StagedAlias'
import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import { stagedAliases } from '@/lib/kb/model/alias'

import { RESETTING } from '@/lib/constants'

const StagedAliases = ({ stagedEdit }) => {
  return (
    <StagedGroup
      group={RESETTING.GROUP.ALIASES}
      stagedEdit={stagedEdit}
      StagedGroupItem={StagedAlias}
      stagedItems={stagedAliases(stagedEdit)}
    />
  )
}

export default StagedAliases
