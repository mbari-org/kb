import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/staged/ResettingButton'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { childResetting } from '@/components/kb/panels/concepts/concept/change/staged/reset'

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
