export const CONCEPT_STATE = {
  INIT_STATE: "INIT_STATE",
  SET_FIELD: "SET_FIELD",
  ADD_MEDIA: "ADD_MEDIA",
  DELETE_MEDIA: "DELETE_MEDIA",
  EDIT_MEDIA: "EDIT_MEDIA",
  NONE: "NONE",
}

import { isPrimary } from "@/lib/kb/concept/media"

const updateMedia = (state, { type, update }) => {
  const { mediaIndex, media } = update
  const updatedItem = { ...state.media[mediaIndex], ...media, action: type }
  return {
    ...state,
    media: state.media.map((item, index) =>
      index === mediaIndex ? updatedItem : item
    ),
  }
}

const conceptReducer = (state, { type, update }) => {
  switch (type) {
    case CONCEPT_STATE.INIT_STATE:
      return update

    case CONCEPT_STATE.SET_FIELD:
      return {
        ...state,
        ...update,
      }

    case CONCEPT_STATE.ADD_MEDIA: {
      const isPrimaryMedia = isPrimary(update.media)
      const addItem = {
        ...update.media,
        isPrimary: isPrimaryMedia,
        action: type,
      }
      return {
        ...state,
        media: [...state.media, addItem],
      }
    }

    case CONCEPT_STATE.DELETE_MEDIA: {
      const stateMedia = state.media[update.mediaIndex]
      if (stateMedia.action === CONCEPT_STATE.ADD_MEDIA) {
        const updatedMedia = state.media.filter(
          (_item, index) => index !== update.mediaIndex
        )
        return {
          ...state,
          media: updatedMedia,
        }
      }
      return updateMedia(state, { type, update })
    }

    case CONCEPT_STATE.EDIT_MEDIA: {
      const stateMedia = state.media[update.mediaIndex]
      if (stateMedia.action === CONCEPT_STATE.ADD_MEDIA) {
        const updatedItem = {
          ...stateMedia,
          ...update.media,
          action: CONCEPT_STATE.ADD_MEDIA,
        }
        return {
          ...state,
          media: state.media.map((item, index) =>
            index === update.mediaIndex ? updatedItem : item
          ),
        }
      }
      return updateMedia(state, { type, update })
    }

    default:
      return state
  }
}

export default conceptReducer
