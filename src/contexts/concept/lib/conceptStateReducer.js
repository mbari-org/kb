const CONCEPT = {
  INIT_STATE: 'Init State',
  MEDIA_ADD: 'Media Add',
  MEDIA_DELETE: 'Media Delete',
  MEDIA_EDIT: 'Media Edit',
  MEDIA_RESTORE: 'Media Restore',
  NAME_ADD: 'Name Add',
  NAME_DELETE: 'Name Delete',
  NAME_EDIT: 'Name Edit',
  NONE: 'None',
  PARENT_UPDATE: 'Parent Update',
  RESET_FIELD: 'Reset Field',
  RESET_MEDIA: 'Reset Media',
  RESET_MEDIA_ITEM: 'Reset Media Item',
  SET_FIELD: 'Set Field',
}

import { isPrimary } from '@/lib/kb/concept/media'

const updateMedia = (state, { type, update }) => {
  const { mediaIndex, mediaItem } = update
  const updatedItem = { ...state.media[mediaIndex], ...mediaItem, action: type }
  return {
    ...state,
    media: state.media.map((item, index) => (index === mediaIndex ? updatedItem : item)),
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
        const updatedMedia = state.media.filter((_item, index) => index !== update.mediaIndex)
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

    case CONCEPT.NAME_ADD:
      return {
        ...state,
        nameUpdate: update.nameUpdate,
      }

    case CONCEPT.NAME_DELETE:
      return {
        ...state,
        nameUpdate: update.nameUpdate,
      }

    case CONCEPT.NAME_EDIT:
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
        media: state.media.map((item, index) => (index === mediaIndex ? mediaItem : item)),
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
