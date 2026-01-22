import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { resettingRealization } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { RESET } = CONCEPT_STATE

const RealizationReset = ({ index }) => {
  return (
    <StagedReset
      group={CONCEPT.FIELD.REALIZATIONS}
      index={index}
      resetGroupType={RESET.REALIZATIONS}
      resetItemType={RESET.REALIZATION}
      resettingFunction={resettingRealization}
    />
  )
}

export default RealizationReset
