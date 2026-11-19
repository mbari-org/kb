import { use } from 'react'

import { createStagedActions } from '@/components/modal/concept/conceptModalUtils'
import useStageTemplate from '@/components/kb/panels/concepts/concept/change/staged/templates/edit/useStageTemplate'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import { isValidTemplate } from '@/components/kb/panels/templates/utils'

const EditTemplateActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)
  const stageTemplate = useStageTemplate()

  const { hasChanges, isDuplicate, templateItem } = modalData
  const stageDisabled = isDuplicate || !hasChanges || !isValidTemplate(templateItem)

  return createStagedActions({
    closeModal,
    confirmReset,
    modifyConcept,
    name: 'EditTemplateActions',
    onStage: stageTemplate,
    stageDisabled,
  })
}

export default EditTemplateActions
