import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'

const PendingFieldTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Concept: ${concept.name}`} />
}

export default PendingFieldTitle
