import { displayItem, stagedEdits } from '@/lib/kb/state/staged'

import { isPendingMedia } from '@/lib/kb/state/media'

import { ACTION, CONCEPT_STATE } from '@/lib/constants'

const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaItemEdits = ({ initial, staged }) =>
  stagedEdits({
    stateTypes: CONCEPT_STATE.MEDIA_ITEM,
    displayFields: MEDIA_DISPLAY_FIELDS,
    initial,
    staged,
  })

const mediaItemFields = mediaItem => displayItem(mediaItem, MEDIA_DISPLAY_FIELDS)

const stagedMediaItem = (mediaItem, pendingConcept) => {
  const pendingMediaItems = pendingConcept.filter(isPendingMedia)

  const pendingAdd = pendingMediaItems.find(
    history => history.action === ACTION.ADD && history.newValue === mediaItem.url
  )
  if (pendingAdd) {
    return {
      ...mediaItem,
      action: 'Add Pending',
      historyId: pendingAdd.id,
    }
  }

  const pendingDelete = pendingMediaItems.find(
    history => history.action === ACTION.DELETE && history.oldValue === mediaItem.url
  )
  if (pendingDelete) {
    return {
      ...mediaItem,
      action: 'Delete Pending',
      historyId: pendingDelete.id,
    }
  }

  const pendingEdit = pendingMediaItems.find(
    history => history.action === ACTION.EDIT && history.newValue === mediaItem.url
  )
  if (pendingEdit) {
    return {
      ...mediaItem,
      action: 'Edit Pending',
      historyId: pendingEdit.id,
    }
  }

  return mediaItem
}

export { getPrimary, hasPrimary, isPrimary, mediaItemEdits, mediaItemFields, stagedMediaItem }
