import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'
import ChangeActionButton from '@/components/kb/panels/concept/change/ChangeActionButton'

const MediaReset = () => {
  const { confirmDiscard, modifyConcept } = use(ConceptContext)

  const resetting =
    confirmDiscard?.type === CONCEPT_STATE.RESET.MEDIA ||
    confirmDiscard?.type === CONCEPT_STATE.RESET.TO_INITIAL

  const onClick = () => {
    modifyConcept({ type: CONCEPT_STATE.RESET.MEDIA })
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

export default MediaReset
