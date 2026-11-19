import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const createTemplateOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    if (!modalData.hasChanges) {
      return true
    }

    modifyConcept({
      type: CONCEPT_STATE.RESET.TEMPLATES,
      update: { templates: initialState.templates, stateId: modalData.templateStateId },
    })
    return false
  }
}

export default createTemplateOnClose
