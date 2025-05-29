import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'

const PendingTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Pending History: ${concept.name}`} />
}

export default PendingTitle
