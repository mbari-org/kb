import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { childResetting } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const ChildReset = ({ child }) => {
  return (
    <StagedReset
      child={child}
      resettingFunction={childResetting}
      resetAllType={RESET.ADD_CHILDREN}
      resetChildType={RESET.ADD_CHILD}
    />
  )
}

export default ChildReset
