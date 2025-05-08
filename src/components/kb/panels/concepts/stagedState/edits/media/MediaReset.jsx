import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'
import EditReset from '../EditReset'

const MediaReset = () => {
  const { modifyConcept } = use(ConceptContext)

  const onClick = () => {
    modifyConcept({ type: CONCEPT_STATE.RESET.MEDIA })
  }

  return <EditReset onClick={onClick} />
}

export default MediaReset
