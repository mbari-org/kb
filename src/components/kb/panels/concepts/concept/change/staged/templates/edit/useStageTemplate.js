import { use } from 'react'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

const useStageTemplate = () => {
  const { modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

  return () => {
    const { action, templateItem, templateStateId } = modalData
    modifyConcept({
      type: action,
      update: { templateItem, templateStateId },
    })
    closeModal(true)
  }
}

export default useStageTemplate
