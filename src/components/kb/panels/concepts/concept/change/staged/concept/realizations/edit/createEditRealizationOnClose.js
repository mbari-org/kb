import { CONCEPT_STATE } from '@/lib/constants'

const createEditRealizationOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    // Handle case where modalData is null (defensive programming)
    if (!modalData) {
      return true
    }

    const { modified, realizationIndex } = modalData

    if (!modified) {
      return true
    }

    modifyConcept({
      type: CONCEPT_STATE.RESET.REALIZATION_ITEM,
      update: { realizationIndex, realizationItem: initialState.realizations[realizationIndex] },
    })
    return false
  }
}

export default createEditRealizationOnClose
