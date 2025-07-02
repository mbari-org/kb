import { use } from 'react'

import Title from '@/components/common/factory/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const EditAliasTitle = () => {
  const { concept } = use(ConceptContext)

  const {
    modalData: { action },
  } = use(ConceptModalContext)
  const actionText = action.split(' ').pop()

  return <Title title={`${actionText} Alias: ${concept.name}`} />
}

EditAliasTitle.displayName = 'EditAliasTitle'

export default EditAliasTitle
