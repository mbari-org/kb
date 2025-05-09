import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'
import EditReset from '../EditReset'

const MediaReset = () => {
  const { confirmAction, modifyConcept } = use(ConceptContext)

  const resetting = confirmAction?.type === CONCEPT_STATE.RESET.MEDIA

  const onClick = () => {
    modifyConcept({ type: CONCEPT_STATE.RESET.MEDIA })
  }

  return <EditReset disabled={confirmAction} onClick={onClick} resetting={resetting} />
}

export default MediaReset
