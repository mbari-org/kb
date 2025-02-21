import { getPrimary, isPrimary } from '@/lib/kb/concept/media'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const mediaState = concept => {
  const { media: conceptMedia } = concept
  const primaryMedia = getPrimary(conceptMedia)
  const otherMedia = conceptMedia.filter(mediaItem => mediaItem.url !== primaryMedia?.url)
  const orderedMedia = primaryMedia ? [primaryMedia, ...otherMedia] : otherMedia

  const media = orderedMedia.map(mediaItem => ({
    ...mediaItem,
    action: CONCEPT_STATE.NO_ACTION,
  }))

  return {
    media,
    mediaIndex: 0,
  }
}

const addMedia = (state, update) => {
  const isPrimaryMedia = isPrimary(update.mediaItem)
  const addItem = {
    ...update.mediaItem,
    isPrimary: isPrimaryMedia,
    action: CONCEPT_STATE.MEDIA_ADD,
  }
  return {
    ...state,
    media: [...state.media, addItem],
  }
}

const deleteMedia = (state, update) => {
  const stateMedia = state.media[update.mediaIndex]
  if (stateMedia.action === CONCEPT_STATE.MEDIA_ADD) {
    const updatedMedia = state.media.filter((_item, index) => index !== update.mediaIndex)
    return {
      ...state,
      media: updatedMedia,
    }
  }
  return updateState(state, { type: CONCEPT_STATE.MEDIA_DELETE, update })
}

const editMedia = (state, update) => {
  const stateMedia = state.media[update.mediaIndex]
  if (stateMedia.action === CONCEPT_STATE.MEDIA_ADD) {
    const updatedItem = {
      ...stateMedia,
      ...update.mediaItem,
      action: CONCEPT_STATE.MEDIA_ADD,
    }
    return {
      ...state,
      media: state.media.map((item, index) => (index === update.mediaIndex ? updatedItem : item)),
    }
  }
  return updateState(state, { type: CONCEPT_STATE.MEDIA_EDIT, update })
}

const updateState = (state, { type, update }) => {
  const { mediaIndex, mediaItem } = update
  const updatedItem = { ...state.media[mediaIndex], ...mediaItem, action: type }
  return {
    ...state,
    media: state.media.map((item, index) => (index === mediaIndex ? updatedItem : item)),
  }
}

export { addMedia, deleteMedia, editMedia, mediaState }
