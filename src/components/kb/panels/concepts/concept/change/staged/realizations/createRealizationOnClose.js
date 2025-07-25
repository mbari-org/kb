import { CONCEPT_STATE } from '@/lib/constants'
import { hasTrueField } from '@/lib/utils'

const createRealizationOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    // Handle case where modalData is null (defensive programming)
    if (!modalData) {
      return true
    }

    const { modified, realizationIndex } = modalData
    const isModified = hasTrueField(modified)

    if (!isModified) {
      return true
    }

    modifyConcept({
      type: CONCEPT_STATE.RESET.REALIZATIONS,
      update: { realizations: initialState.realizations, index: realizationIndex },
    })
    return false
  }
}

export default createRealizationOnClose
