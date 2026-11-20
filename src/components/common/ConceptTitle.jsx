import { use } from 'react'

import Title from '@/components/common/factory/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import CONFIG from '@/lib/config'

const ConceptTitle = () => {
  const { concept } = use(ConceptContext)

  if (!concept) return <Title title={CONFIG.UI.LOADING.CONCEPT} />

  return <Title title={`Concept: ${concept.name}`} />
}

export default ConceptTitle
