import StagedReset from '@/components/kb/panels/concepts/concept/change/staged/StagedReset'

import { realizationResetting } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const RealizationReset = ({ index }) => {
  return (
    <StagedReset
      index={index}
      resettingFunction={realizationResetting}
      collectionKey='realizations'
      resetAllType={RESET.REALIZATIONS}
      resetItemType={RESET.REALIZATION_ITEM}
    />
  )
}

export default RealizationReset
