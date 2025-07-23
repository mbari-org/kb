import StagedValue from '@/components/kb/panels/concepts/concept/change/staged/StagedValue'

import { RESETTING } from '@/lib/constants'

const { GROUP } = RESETTING

const StagedAuthor = ({ stagedEdit }) => {
  return <StagedValue group={GROUP.AUTHOR} stagedEdit={stagedEdit} />
}

export default StagedAuthor
