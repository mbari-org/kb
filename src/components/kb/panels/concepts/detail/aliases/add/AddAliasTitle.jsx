import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'

const AddAliasTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Add Alias: ${concept.name}`} />
}

AddAliasTitle.displayName = 'AddAliasTitle'

export default AddAliasTitle
