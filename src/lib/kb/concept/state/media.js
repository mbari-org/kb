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
  const mediaItem = {
    ...update.mediaItem,
    isPrimary: isPrimaryMedia,
    action: CONCEPT_STATE.MEDIA.ADD,
  }
  return {
    ...state,
    media: [...state.media, mediaItem],
  }
}

const deleteMedia = (state, update) => {
  const mediaItem = state.media[update.mediaIndex]
  // If media is an add, just remove it from state
  if (mediaItem.action === CONCEPT_STATE.MEDIA.ADD) {
    const updatedMedia = state.media.filter((_item, index) => index !== update.mediaIndex)
    return {
      ...state,
      media: updatedMedia,
    }
  }
  return updateState(state, { type: CONCEPT_STATE.MEDIA.DELETE, update })
}

const editMedia = (state, update) => {
  const mediaItem = state.media[update.mediaIndex]
  if (mediaItem.action === CONCEPT_STATE.MEDIA.ADD) {
    const updatedItem = {
      ...mediaItem,
      ...update.mediaItem,
      action: CONCEPT_STATE.MEDIA.ADD,
    }
    return {
      ...state,
      media: state.media.map((item, index) => (index === update.mediaIndex ? updatedItem : item)),
    }
  }
  return updateState(state, { type: CONCEPT_STATE.MEDIA.EDIT, update })
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
