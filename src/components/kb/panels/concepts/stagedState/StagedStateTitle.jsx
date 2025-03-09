import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'

const StagedStateTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Current Edits: ${concept.name}`} />
}

export default StagedStateTitle
