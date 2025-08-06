import { getPrimary, isPrimary } from '@/lib/kb/model/media'

import { stagedEdits } from '@/lib/kb/state/staged'

import { stagedMediaItem } from '@/lib/kb/model/media'

import { CONCEPT_STATE, HISTORY_FIELD } from '@/lib/constants'

const addMedia = (state, update) => {
  const isPrimaryMedia = isPrimary(update.mediaItem)
  const mediaIndex = state.media.length
  const mediaItem = {
    ...update.mediaItem,
    action: CONCEPT_STATE.MEDIA_ITEM.ADD,
    isPrimary: isPrimaryMedia,
    index: mediaIndex,
  }
  return {
    ...state,
    media: [...state.media, mediaItem],
    mediaIndex,
  }
}

const deleteMedia = (state, update) => {
  const mediaItem = state.media[update.mediaIndex]
  // If media is an add, just remove it from state
  if (mediaItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
    const updatedMedia = state.media.filter((_item, index) => index !== update.mediaIndex)
    return {
      ...state,
      media: updatedMedia,
    }
  }
  return updateState(state, { type: CONCEPT_STATE.MEDIA_ITEM.DELETE, update })
}

const editMedia = (state, update) => {
  const mediaItem = state.media[update.mediaIndex]
  // If editing an added media item, don't change the action
  if (mediaItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
    const updatedItem = {
      ...update.mediaItem,
      action: CONCEPT_STATE.MEDIA_ITEM.ADD,
    }
    return {
      ...state,
      media: state.media.map((item, index) => (index === update.mediaIndex ? updatedItem : item)),
    }
  }
  return updateState(state, { type: CONCEPT_STATE.MEDIA_ITEM.EDIT, update })
}

const isPendingMedia = pendingItem => pendingItem.field === HISTORY_FIELD.MEDIA

const mediaState = (concept, pending) => {
  const { media: conceptMedia } = concept
  const primaryMedia = getPrimary(conceptMedia)
  const otherMedia = conceptMedia.filter(mediaItem => mediaItem.url !== primaryMedia?.url)
  const orderedMedia = primaryMedia ? [primaryMedia, ...otherMedia] : otherMedia

  const media = orderedMedia.map((mediaItem, index) =>
    stagedMediaItem({ ...mediaItem, action: CONCEPT_STATE.NO_ACTION, index }, pending)
  )

  return { media }
}

const resetMedia = (state, update) => {
  const { index: resetIndex } = update

  if (1 < state.media.length && resetIndex !== undefined) {
    const mediaItem = update.media[resetIndex]
    return {
      ...state,
      media: state.media.reduce((acc, item, index) => {
        index === resetIndex ? mediaItem != null && acc.push(mediaItem) : acc.push(item)
        return acc
      }, []),
    }
  }
  return {
    ...state,
    media: update.media,
  }
}

const stagedMedia = stagedEdit => {
  const [_field, media] = stagedEdit

  return stagedEdits({
    displayFields: ['url', 'credit', 'caption', 'isPrimary'],
    initial: media.initial,
    staged: media.staged,
    stateTypes: CONCEPT_STATE.MEDIA_ITEM,
  })
}

const updateState = (state, { type, update }) => {
  const { mediaIndex, mediaItem } = update
  const updatedItem = { ...mediaItem, action: type }
  const updatedMedia = state.media.map((stateItem, stateIndex) =>
    stateIndex === mediaIndex ? updatedItem : stateItem
  )
  return { ...state, media: updatedMedia }
}

export { addMedia, deleteMedia, editMedia, isPendingMedia, mediaState, resetMedia, stagedMedia }
