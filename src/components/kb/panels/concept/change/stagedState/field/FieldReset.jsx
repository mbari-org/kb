import { use } from 'react'

import ChangeActionButton from '@/components/kb/panels/concept/change/ChangeActionButton'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const FieldReset = ({ field }) => {
  const { confirmDiscard, modifyConcept } = use(ConceptContext)

  const resetting =
    confirmDiscard?.type === CONCEPT_STATE.RESET.TO_INITIAL ||
    (confirmDiscard?.type === CONCEPT_STATE.RESET.FIELD && confirmDiscard?.update?.field === field)

  const onClick = () => modifyConcept({ type: CONCEPT_STATE.RESET.FIELD, update: { field } })

  return (
    <ChangeActionButton
      changing={resetting}
      color='cancel'
      disabled={confirmDiscard}
      onClick={onClick}
    />
  )
}

export default FieldReset
