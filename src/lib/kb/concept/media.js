import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaBorder = (mediaItem, theme) => {
  const borderWidth = mediaItem?.action === CONCEPT_STATE.NO_ACTION ? '1px' : '3px'
  let borderColor
  switch (mediaItem?.action) {
    case CONCEPT_STATE.MEDIA.ADD:
      borderColor = theme.palette.primary.clean
      break
    case CONCEPT_STATE.MEDIA.EDIT:
      borderColor = theme.palette.primary.modified
      break
    case CONCEPT_STATE.MEDIA.DELETE:
      borderColor = theme.palette.primary.remove
      break
    default:
      borderColor = theme.palette.grey[300]
  }
  return `${borderWidth} solid ${borderColor}`
}

const mediaItemEdit = (mediaIndex, initialItem, editingItem) => {
  const { action: editingAction } = editingItem

  if (editingAction === CONCEPT_STATE.NO_ACTION) {
    return null
  }

  const initialFields =
    editingAction === CONCEPT_STATE.MEDIA.ADD ? null : mediaItemFields(initialItem)

  const editingFields =
    editingAction === CONCEPT_STATE.MEDIA.DELETE ? null : mediaItemFields(editingItem)

  return [mediaIndex, editingAction, initialFields, editingFields]
}

const mediaItemEdits = (initial, editing) =>
  editing.map((editingItem, editingIndex) => {
    const initialItem = initial[editingIndex]
    return mediaItemEdit(editingIndex, initialItem, editingItem)
  })

const mediaItemFields = mediaItem =>
  MEDIA_DISPLAY_FIELDS.reduce((fields, field) => {
    fields.push([field, mediaItem[field]])
    return fields
  }, [])

export { getPrimary, hasPrimary, isPrimary, mediaBorder, mediaItemEdits, mediaItemFields }
