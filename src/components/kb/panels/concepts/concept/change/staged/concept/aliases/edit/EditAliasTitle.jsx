import { use } from 'react'

import Title from '@/components/modal/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelModalContext from '@/contexts/modal/PanelModalContext'

const EditAliasTitle = () => {
  const { concept } = use(ConceptContext)

  const {
    modalData: { action },
  } = use(PanelModalContext)
  const actionText = action.split(' ').pop()

  return <Title title={`${actionText} Alias: ${concept.name}`} />
}

EditAliasTitle.displayName = 'EditAliasTitle'

export default EditAliasTitle
