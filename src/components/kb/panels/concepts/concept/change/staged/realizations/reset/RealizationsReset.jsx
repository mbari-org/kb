import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/ResettingButton'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { realizationResetting } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const RealizationsReset = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)

  const resetting = realizationResetting(confirmReset) === RESETTING.ME

  const onClick = () => {
    modifyConcept({ type: RESET.REALIZATIONS })
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

export default RealizationsReset

