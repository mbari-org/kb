import { CONCEPT_STATE } from '@/lib/constants'
import { displayItem, fieldEdits } from '@/lib/kb/model/field'
import { fieldPendingHistory } from '@/lib/kb/model/history'

const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaItemEdits = ({ initial, staged }) =>
  fieldEdits({
    stateType: CONCEPT_STATE.MEDIA,
    displayFields: MEDIA_DISPLAY_FIELDS,
    initial,
    staged,
  })

const mediaItemFields = mediaItem => displayItem(mediaItem, MEDIA_DISPLAY_FIELDS)

const stagedMediaItem = (mediaItem, pendingHistory) => {
  const pendingMediaItemActions = fieldPendingHistory(pendingHistory, 'Media')

  const pendingAdd = pendingMediaItemActions.find(
    history => history.action === 'ADD' && history.newValue === mediaItem.url
  )
  if (pendingAdd) {
    return {
      ...mediaItem,
      action: 'PENDING ADD',
      historyId: pendingAdd.id,
    }
  }

  const pendingDelete = pendingMediaItemActions.find(
    history => history.action === 'DELETE' && history.oldValue === mediaItem.url
  )
  if (pendingDelete) {
    return {
      ...mediaItem,
      action: 'PENDING DELETE',
      historyId: pendingDelete.id,
    }
  }

  const pendingEdit = pendingMediaItemActions.find(
    history => history.action === 'EDIT' && history.newValue === mediaItem.url
  )
  if (pendingEdit) {
    return {
      ...mediaItem,
      action: 'PENDING EDIT',
      historyId: pendingEdit.id,
    }
  }

  return mediaItem
}

export { getPrimary, hasPrimary, isPrimary, mediaItemEdits, mediaItemFields, stagedMediaItem }
