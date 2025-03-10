import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
const EditMediaTitle = () => {
  const { concept, stagedState } = use(ConceptContext)

  const { modalData } = use(ModalContext)
  const { action: modalAction, mediaIndex } = modalData

  const action = stagedState?.media?.[mediaIndex]?.action || modalAction
  const actionText = action.split(' ').pop()

  return <Title title={`${actionText} Media: ${concept.name}`} />
}

EditMediaTitle.displayName = 'EditMediaTitle'

export default EditMediaTitle
