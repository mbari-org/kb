import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
const EditMediaTitle = () => {
  const { concept } = use(ConceptContext)

  const { modalData } = use(PanelModalContext)
  const actionText = modalData?.action?.split(' ').pop() || 'Edit'

  return <Title title={`${actionText} Media: ${concept.name}`} />
}

EditMediaTitle.displayName = 'EditMediaTitle'

export default EditMediaTitle
