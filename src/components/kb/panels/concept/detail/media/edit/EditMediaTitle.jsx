import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
const EditMediaTitle = () => {
  const { concept } = use(ConceptContext)

  const { modalData } = use(ModalContext)
  const actionText = modalData.action.split(' ').pop()

  return <Title title={`${actionText} Media: ${concept.name}`} />
}

EditMediaTitle.displayName = 'EditMediaTitle'

export default EditMediaTitle
