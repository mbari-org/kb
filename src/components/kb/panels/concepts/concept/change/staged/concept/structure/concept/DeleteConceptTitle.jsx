import { use } from 'react'

import Title from '@/components/common/factory/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const DeleteConceptTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Delete: ${concept.name}`} />
}

export default DeleteConceptTitle
