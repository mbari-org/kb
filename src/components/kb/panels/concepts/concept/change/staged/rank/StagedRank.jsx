import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'

import { RESETTING } from '@/lib/constants'

const { GROUP } = RESETTING

const StagedRank = ({ stagedEdit }) => {
  return (
    <StagedItems
      group={GROUP.RANK}
      stagedEdit={stagedEdit}
      StagedGroupItem={() => null}
      stagedItems={[]}
    />
  )
}

export default StagedRank
