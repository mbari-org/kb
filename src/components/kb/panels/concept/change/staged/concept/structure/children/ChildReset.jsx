import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concept/change/ResettingButton'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { childResetting } from '@/components/kb/panels/concept/change/staged/concept/util'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const ChildReset = ({ child }) => {
  const { confirmReset, modifyConcept, stagedState } = use(ConceptContext)

  const resetting = childResetting(confirmReset, child) === RESETTING.ME

  const onClick = () => {
    // If last child, do RESET.ADD_CHILDREN
    stagedState.children.length === 1
      ? modifyConcept({ type: RESET.ADD_CHILDREN })
      : modifyConcept({
          type: RESET.ADD_CHILD,
          update: { child },
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

export default ChildReset
