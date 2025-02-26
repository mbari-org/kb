import { addAlias, deleteAlias, editAlias } from '@/lib/kb/concept/state/aliases'
import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'
import { addMedia, deleteMedia, editMedia } from '@/lib/kb/concept/state/media'

const conceptStateReducer = (state, { type, update }) => {
  switch (type) {
    case CONCEPT_STATE.INITIAL:
      return update

    case CONCEPT_STATE.ALIAS.ADD:
      return addAlias(state, update)

    case CONCEPT_STATE.ALIAS.DELETE:
      return deleteAlias(state, update)

    case CONCEPT_STATE.ALIAS.EDIT:
      return editAlias(state, update)

    case CONCEPT_STATE.MEDIA.ADD:
      return addMedia(state, update)

    case CONCEPT_STATE.MEDIA.DELETE:
      return deleteMedia(state, update)

    case CONCEPT_STATE.MEDIA.EDIT:
      return editMedia(state, update)

    case CONCEPT_STATE.PARENT_UPDATE:
      return {
        ...state,
        parentName: update.parentName,
      }

    case CONCEPT_STATE.RESET.FIELD: {
      const { field, value } = update

      return {
        ...state,
        [field]: value,
      }
    }

    case CONCEPT_STATE.RESET.MEDIA: {
      const { media } = update
      return {
        ...state,
        media,
      }
    }

    case CONCEPT_STATE.RESET.MEDIA_ITEM: {
      const { mediaIndex, mediaItem } = update
      return {
        ...state,
        media: state.media.map((item, index) => (index === mediaIndex ? mediaItem : item)),
      }
    }

    case CONCEPT_STATE.SET_FIELD:
      return {
        ...state,
        ...update,
      }

    default:
      return state
  }
}

export { conceptStateReducer }
