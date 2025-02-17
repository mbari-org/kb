import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT } from '@/contexts/concept/lib/conceptStateReducer'
import Reset from '../Reset'

const MediaReset = () => {
  const { modifyConcept } = use(ConceptContext)

  const onClick = () => {
    modifyConcept({ type: CONCEPT.RESET_MEDIA })
  }

  return <Reset onClick={onClick} />
}

export default MediaReset
