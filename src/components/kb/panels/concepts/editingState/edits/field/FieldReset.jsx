import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT } from '@/contexts/concept/lib/conceptStateReducer'
import Reset from '../Reset'

const FieldReset = ({ field }) => {
  const { modifyConcept } = use(ConceptContext)

  const onClick = () => modifyConcept({ type: CONCEPT.RESET_FIELD, field })

  return <Reset onClick={onClick} />
}

export default FieldReset
