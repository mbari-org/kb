import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'
import Reset from '../Reset'

const MediaReset = () => {
  const { modifyConcept } = use(ConceptContext)

  const onClick = () => {
    modifyConcept({ type: CONCEPT_STATE.RESET_MEDIA })
  }

  return <Reset onClick={onClick} />
}

export default MediaReset
