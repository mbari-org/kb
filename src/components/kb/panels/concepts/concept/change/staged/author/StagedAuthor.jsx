import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import { RESETTING } from '@/lib/constants'

const { GROUP } = RESETTING

const StagedAuthor = ({ stagedEdit }) => {
  const [_field, { initial }] = stagedEdit

  return <StagedGroup group={GROUP.AUTHOR} initial={initial} stagedEdit={stagedEdit} />
}

export default StagedAuthor
