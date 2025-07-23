import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import { RESETTING } from '@/lib/constants'

const { GROUP } = RESETTING

const StagedRank = ({ stagedEdit }) => {
  return (
    <StagedGroup
      group={GROUP.RANK}
      stagedEdit={stagedEdit}
      StagedGroupItem={() => null}
      stagedItems={[]}
    />
  )
}

export default StagedRank
