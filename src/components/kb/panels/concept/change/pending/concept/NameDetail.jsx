import { use } from 'react'

import FieldDetail from '@/components/kb/panels/concept/change/pending/concept/FieldDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'

const NameDetail = ({ pending }) => {
  const { concept } = use(ConceptContext)

  const pendingName = pending('ConceptName').find(name => name.newValue === concept.name)

  if (!pendingName) {
    return null
  }

  return <FieldDetail key={pendingName.id} pendingField={pendingName} />
}

export default NameDetail
