import { MEDIA_STATE } from "@/lib/kb/concept/media"

const conceptReducer = (state, { type, update }) => {
  switch (type) {
    case "INIT_STATE":
      return update

    case "SET_FIELD":
      return {
        ...state,
        ...update,
      }

    case "ADD_MEDIA": {
      const mediaItem = { ...update, action: MEDIA_STATE.ADD }
      return {
        ...state,
        media: [...state.media, mediaItem],
      }
    }

    case "DELETE_MEDIA": {
      const mediaItem = state.media[update.mediaIndex]
      const updatedItem = { ...mediaItem, action: MEDIA_STATE.DELETE }
      return {
        ...state,
        media: state.media.map((item, index) =>
          index === update.mediaIndex ? updatedItem : item
        ),
      }
    }

    case "EDIT_MEDIA": {
      const updatedItem = { ...update, action: MEDIA_STATE.EDIT }
      return {
        ...state,
        media: state.media.map((item, index) =>
          index === update.mediaIndex ? updatedItem : item
        ),
      }
    }

    default:
      return state
  }
}

export default conceptReducer
