import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concept/change/ResettingButton'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { childResetting } from '@/components/kb/panels/concept/change/staged/concept/confirmReset'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const ChildrenReset = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)

  const resetting = childResetting(confirmReset) === RESETTING.ME

  const onClick = () => {
    modifyConcept({ type: RESET.ADD_CHILDREN })
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

export default ChildrenReset
