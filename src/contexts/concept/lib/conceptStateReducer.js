const CONCEPT = {
  INIT_STATE: "INIT_STATE",
  MEDIA_ADD: "MEDIA_ADD",
  MEDIA_DELETE: "MEDIA_DELETE",
  MEDIA_EDIT: "MEDIA_EDIT",
  MEDIA_RESTORE: "MEDIA_RESTORE",
  NAME_UPDATE: "NAME_UPDATE",
  NONE: "NONE",
  PARENT_UPDATE: "PARENT_UPDATE",
  RESET_FIELD: "RESET_FIELD",
  RESET_MEDIA: "RESET_MEDIA",
  RESET_MEDIA_ITEM: "RESET_MEDIA_ITEM",
  SET_FIELD: "SET_FIELD",
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

const conceptStateReducer = (state, { type, update }) => {
  switch (type) {
    case CONCEPT.INIT_STATE:
      return update

    case CONCEPT.MEDIA_ADD: {
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

    case CONCEPT.MEDIA_DELETE: {
      const stateMedia = state.media[update.mediaIndex]
      if (stateMedia.action === CONCEPT.MEDIA_ADD) {
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

    case CONCEPT.MEDIA_EDIT: {
      const stateMedia = state.media[update.mediaIndex]
      if (stateMedia.action === CONCEPT.MEDIA_ADD) {
        const updatedItem = {
          ...stateMedia,
          ...update.mediaItem,
          action: CONCEPT.MEDIA_ADD,
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

    case CONCEPT.MEDIA_RESTORE: {
      const restoreMediaItem = {
        ...update.mediaItem,
        action: CONCEPT.NONE,
      }
      const updatedMedia = state.media.map((mediaItem, mediaIndex) =>
        mediaIndex === update.mediaIndex ? restoreMediaItem : mediaItem
      )
      return { ...state, media: updatedMedia }
    }

    case CONCEPT.NAME_UPDATE:
      return {
        ...state,
        nameUpdate: update.nameUpdate,
      }

    case CONCEPT.PARENT_UPDATE:
      return {
        ...state,
        parentName: update.parentName,
      }

    case CONCEPT.RESET_FIELD: {
      const { field, value } = update

      return {
        ...state,
        [field]: value,
      }
    }

    case CONCEPT.RESET_MEDIA: {
      const { media } = update
      return {
        ...state,
        media,
      }
    }

    case CONCEPT.RESET_MEDIA_ITEM: {
      const { mediaIndex, mediaItem } = update
      return {
        ...state,
        media: state.media.map((item, index) =>
          index === mediaIndex ? mediaItem : item
        ),
      }
    }

    case CONCEPT.SET_FIELD:
      return {
        ...state,
        ...update,
      }

    default:
      return state
  }
}

export { CONCEPT, conceptStateReducer }
