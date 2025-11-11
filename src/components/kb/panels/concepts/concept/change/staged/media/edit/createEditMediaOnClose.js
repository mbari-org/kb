import { CONCEPT_STATE } from '@/lib/constants/constants'

const createEditMediaOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    const { modified, mediaIndex } = modalData

    if (!modified) {
      return true
    }

    modifyConcept({
      type: CONCEPT_STATE.RESET.MEDIA,
      update: { mediaIndex, mediaItem: initialState.media[mediaIndex] },
    })
    return false
  }
}

export default createEditMediaOnClose
