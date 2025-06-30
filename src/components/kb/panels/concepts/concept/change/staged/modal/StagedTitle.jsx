import { use } from 'react'

import Title from '@/components/common/factory/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const StagedTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Staged Edits: ${concept.name}`} />
}

export default StagedTitle
