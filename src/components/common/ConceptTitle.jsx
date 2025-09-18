import { use } from 'react'

import Title from '@/components/common/factory/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const ConceptTitle = () => {
  const { concept } = use(ConceptContext)

  if (!concept) return <Title title='Concept: Loading...' />

  return <Title title={`Concept: ${concept.name}`} />
}

export default ConceptTitle
