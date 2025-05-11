import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

const EditAliasTitle = () => {
  const { concept } = use(ConceptContext)

  const {
    modalData: { action },
  } = use(ModalContext)
  const actionText = action.split(' ').pop()

  return <Title title={`${actionText} Alias: ${concept.name}`} />
}

EditAliasTitle.displayName = 'EditAliasTitle'

export default EditAliasTitle
