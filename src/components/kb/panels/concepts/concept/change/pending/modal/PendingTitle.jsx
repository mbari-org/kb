import { use } from 'react'

import Title from '@/components/common/factory/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const PendingTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Pending History: ${concept.name}`} />
}

export default PendingTitle
