import { use } from 'react'

import Title from '@/components/common/factory/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

const EditAliasTitle = () => {
  const { concept } = use(ConceptContext)

  const {
    modalData: { action },
  } = use(HOLDModalContext)
  const actionText = action.split(' ').pop()

  return <Title title={`${actionText} Alias: ${concept.name}`} />
}

EditAliasTitle.displayName = 'EditAliasTitle'

export default EditAliasTitle
