import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'
import { pickFields } from '@/lib/util'

const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaBorder = (mediaItem, theme) => {
  const borderWidth = mediaItem?.action === CONCEPT_STATE.NO_ACTION ? '1px' : '2px'
  let borderColor
  switch (mediaItem?.action) {
    case CONCEPT_STATE.MEDIA_ADD:
      borderColor = theme.concept.color.clean
      break
    case CONCEPT_STATE.MEDIA_EDIT:
      borderColor = theme.palette.primary.main
      break
    case CONCEPT_STATE.MEDIA_DELETE:
      borderColor = theme.concept.color.remove
      break
    default:
      borderColor = theme.palette.grey[300]
  }
  return `${borderWidth} solid ${borderColor}`
}

const mediaEdits = (initial, editing) =>
  editing.map((editingItem, editingIndex) => {
    let mediaItemEdits
    switch (editingItem.action) {
      case CONCEPT_STATE.NO_ACTION:
        mediaItemEdits = null
        break
      case CONCEPT_STATE.MEDIA_ADD:
        mediaItemEdits = editingItem
        break
      case CONCEPT_STATE.MEDIA_DELETE:
        mediaItemEdits = pickFields(initial[editingIndex], MEDIA_DISPLAY_FIELDS)
        break
      case CONCEPT_STATE.MEDIA_EDIT: {
        const initialItem = initial[editingIndex]
        mediaItemEdits = MEDIA_DISPLAY_FIELDS.reduce((edits, field) => {
          if (editingItem[field] !== initialItem[field]) {
            edits.push([field, { initial: initialItem[field], editing: editingItem[field] }])
          }
          return edits
        }, [])

        break
      }
      default:
        mediaItemEdits = null
        break
    }
    return { action: editingItem.action, mediaItemEdits }
  })

const mediaItemEdit = (mediaIndex, initialItem, editingItem) => {
  const { action: editingAction } = editingItem

  if (editingAction === CONCEPT_STATE.NO_ACTION) {
    return null
  }

  const initialFields =
    editingAction === CONCEPT_STATE.MEDIA_ADD ? null : mediaItemFields(initialItem)

  const editingFields =
    editingAction === CONCEPT_STATE.MEDIA_DELETE ? null : mediaItemFields(editingItem)

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

export {
  getPrimary,
  hasPrimary,
  isPrimary,
  mediaBorder,
  mediaEdits,
  mediaItemEdits,
  mediaItemFields,
}
