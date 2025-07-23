import StagedObject from '@/components/kb/panels/concepts/concept/change/staged/StagedObject'

import { RESETTING } from '@/lib/constants'

const { GROUP } = RESETTING

const StagedRank = ({ stagedEdit }) => {
  return <StagedObject group={GROUP.RANK} stagedEdit={stagedEdit} />
}

export default StagedRank
