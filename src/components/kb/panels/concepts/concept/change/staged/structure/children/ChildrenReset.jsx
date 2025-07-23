import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingChild } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const ChildrenReset = () => {
  return (
    <StagedReset
      resettingFunction={resettingChild}
      resetGroupType={RESET.ADD_CHILDREN}
      resetChildType={RESET.ADD_CHILD}
    />
  )
}

export default ChildrenReset
