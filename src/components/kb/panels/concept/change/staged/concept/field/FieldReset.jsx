import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concept/change/ResettingButton'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { fieldResetting } from '@/components/kb/panels/concept/change/staged/concept/confirmReset'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const FieldReset = ({ field }) => {
  const { confirmReset, modifyConcept } = use(ConceptContext)

  const resetting = fieldResetting(confirmReset, field) === RESETTING.ME

  const onClick = () => modifyConcept({ type: CONCEPT_STATE.RESET.FIELD, update: { field } })

  return (
    <ResettingButton
      color='cancel'
      disabled={confirmReset}
      onClick={onClick}
      resetting={resetting}
    />
  )
}

export default FieldReset
