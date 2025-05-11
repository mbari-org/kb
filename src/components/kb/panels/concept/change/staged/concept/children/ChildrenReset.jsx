import { use } from 'react'

import ChangeActionButton from '@/components/kb/panels/concept/change/ChangeActionButton'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const ChildrenReset = () => {
  const { confirmDiscard, modifyConcept } = use(ConceptContext)

  const resetting =
    confirmDiscard?.type === RESET.ADD_CHILDREN || confirmDiscard?.type === RESET.TO_INITIAL

  const onClick = () => {
    modifyConcept({ type: RESET.ADD_CHILDREN })
  }

  return (
    <ChangeActionButton
      changing={resetting}
      color='cancel'
      disabled={confirmDiscard}
      onClick={onClick}
    />
  )
}

export default ChildrenReset
