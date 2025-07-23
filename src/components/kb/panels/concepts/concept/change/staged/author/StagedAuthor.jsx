import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import { RESETTING } from '@/lib/constants'

const { GROUP } = RESETTING

const StagedAuthor = ({ stagedEdit }) => {
  return (
    <StagedGroup
      fieldItem
      group={GROUP.AUTHOR}
      stagedEdit={stagedEdit}
      StagedGroupItem={() => null}
      stagedItems={[]}
    />
  )
}

export default StagedAuthor
