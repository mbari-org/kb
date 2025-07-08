import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/ResettingButton'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import {
  realizationResetting,
  isStagedAction,
} from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const RealizationReset = ({ index }) => {
  const { confirmReset, stagedState, modifyConcept } = use(ConceptContext)

  const resetting = realizationResetting(confirmReset, index) === RESETTING.ME

  const onClick = () => {
    // If last realization, do RESET.REALIZATIONS
    const count = stagedState.realizations.filter(item => isStagedAction(item.action)).length
    count === 1
      ? modifyConcept({ type: RESET.REALIZATIONS })
      : modifyConcept({
          type: RESET.REALIZATION_ITEM,
          update: { index },
        })
  }

  return (
    <ResettingButton
      color='cancel'
      disabled={confirmReset}
      onClick={onClick}
      resetting={resetting}
    />
  )
}

export default RealizationReset
