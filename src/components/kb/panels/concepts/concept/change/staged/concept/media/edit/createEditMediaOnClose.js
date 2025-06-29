import { CONCEPT_STATE } from '@/lib/constants'

const createEditMediaOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    // Handle case where modalData is null
    if (!modalData) {
      return true
    }

    const { modified, mediaIndex } = modalData

    if (!modified) {
      return true
    }

    modifyConcept({
      type: CONCEPT_STATE.RESET.MEDIA_ITEM,
      update: { mediaIndex, mediaItem: initialState.media[mediaIndex] },
    })
    return false
  }
}

export default createEditMediaOnClose
