import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'
import { hasTrue } from '@/lib/utils'

const createRealizationOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    const { modified, realizationIndex } = modalData
    const isModified = hasTrue(modified)

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
