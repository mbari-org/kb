import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const createEditMediaOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
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
