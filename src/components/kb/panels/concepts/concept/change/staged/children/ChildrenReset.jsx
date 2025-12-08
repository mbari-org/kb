import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingChild } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

const { RESET } = CONCEPT_STATE

const ChildrenReset = () => {
  return (
    <StagedReset
      resettingFunction={resettingChild}
      resetGroupType={RESET.CHILDREN}
      resetChildType={RESET.CHILD}
    />
  )
}

export default ChildrenReset
