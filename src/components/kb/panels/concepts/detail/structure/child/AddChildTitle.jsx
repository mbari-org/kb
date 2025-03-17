import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'

const AddChildTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Add Child to: ${concept.name}`} />
}

export default AddChildTitle
