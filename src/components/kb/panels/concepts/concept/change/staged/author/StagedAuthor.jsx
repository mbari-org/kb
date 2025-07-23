import StagedField from '@/components/kb/panels/concepts/concept/change/staged/StagedField'

import { RESETTING } from '@/lib/constants'

const { GROUP } = RESETTING

const StagedAuthor = ({ stagedEdit }) => {
  return <StagedField group={GROUP.AUTHOR} stagedEdit={stagedEdit} />
}

export default StagedAuthor
