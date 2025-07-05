import { use } from 'react'

import Title from '@/components/common/factory/Title'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const EditRealizationTitle = () => {
  const { concept } = use(ConceptContext)

  const { modalData } = use(ConceptModalContext)
  const actionText = modalData?.action?.split(' ').pop() || 'Edit'

  return <Title title={`${actionText} Realization: ${concept.name}`} />
}

EditRealizationTitle.displayName = 'EditRealizationTitle'

export default EditRealizationTitle
