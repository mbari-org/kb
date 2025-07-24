import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingRealization } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const RealizationReset = ({ index }) => {
  return (
    <StagedReset
      group='realizations'
      index={index}
      resetGroupType={RESET.REALIZATIONS}
      resetItemType={RESET.REALIZATION}
      resettingFunction={resettingRealization}
    />
  )
}

export default RealizationReset
