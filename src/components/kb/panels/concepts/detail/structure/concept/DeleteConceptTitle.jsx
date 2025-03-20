import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'

const DeleteConceptTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Delete: ${concept.name}`} />
}

export default DeleteConceptTitle
