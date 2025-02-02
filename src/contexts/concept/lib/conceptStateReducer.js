export const CONCEPT_STATE = {
  INIT_STATE: "INIT_STATE",
  SET_FIELD: "SET_FIELD",
  ADD_MEDIA: "ADD_MEDIA",
  DELETE_MEDIA: "DELETE_MEDIA",
  EDIT_MEDIA: "EDIT_MEDIA",
  NONE: "NONE",
  RESTORE_MEDIA: "RESTORE_MEDIA",
}

import { isPrimary } from "@/lib/kb/concept/media"

const updateMedia = (state, { type, update }) => {
  const { mediaIndex, mediaItem } = update
  const updatedItem = { ...state.media[mediaIndex], ...mediaItem, action: type }
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
      const isPrimaryMedia = isPrimary(update.mediaItem)
      const addItem = {
        ...update.mediaItem,
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
          ...update.mediaItem,
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

    case CONCEPT_STATE.RESTORE_MEDIA: {
      const restoreMediaItem = {
        ...update.mediaItem,
        action: CONCEPT_STATE.NONE,
      }
      const updatedMedia = state.media.map((mediaItem, mediaIndex) =>
        mediaIndex === update.mediaIndex ? restoreMediaItem : mediaItem
      )
      return { ...state, media: updatedMedia }
    }

    default:
      return state
  }
}

export default conceptReducer
