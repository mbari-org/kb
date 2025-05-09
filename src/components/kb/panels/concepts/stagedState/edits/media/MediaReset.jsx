import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'
import EditReset from '../EditReset'

const MediaReset = () => {
  const { confirmDiscard, modifyConcept } = use(ConceptContext)

  const resetting = confirmDiscard?.type === CONCEPT_STATE.RESET.MEDIA

  const onClick = () => {
    modifyConcept({ type: CONCEPT_STATE.RESET.MEDIA })
  }

  return <EditReset disabled={confirmDiscard} onClick={onClick} resetting={resetting} />
}

export default MediaReset
