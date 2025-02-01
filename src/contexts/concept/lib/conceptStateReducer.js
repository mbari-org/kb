export const CONCEPT_STATE = {
  INIT_STATE: "INIT_STATE",
  SET_FIELD: "SET_FIELD",
  ADD_MEDIA: "ADD_MEDIA",
  DELETE_MEDIA: "DELETE_MEDIA",
  EDIT_MEDIA: "EDIT_MEDIA",
  NONE: "NONE",
}

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
      const addItem = { ...update, action: type }
      return {
        ...state,
        media: [...state.media, addItem],
      }
    }

    case CONCEPT_STATE.DELETE_MEDIA:
      return updateMedia(state, { type, update })

    case CONCEPT_STATE.EDIT_MEDIA:
      return updateMedia(state, { type, update })

    default:
      return state
  }
}

export default conceptReducer
