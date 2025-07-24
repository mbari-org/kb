import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingChild } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const ChildReset = ({ child }) => {
  return (
    <StagedReset
      child={child}
      resettingFunction={resettingChild}
      resetGroupType={RESET.CHILDREN}
      resetChildType={RESET.CHILD}
    />
  )
}

export default ChildReset
