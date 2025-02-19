import { CONCEPT } from '@/contexts/concept/lib/conceptStateReducer'

import { pickFields } from '@/lib/util'

const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaBorder = (mediaItem, theme) => {
  const borderWidth = mediaItem?.action === CONCEPT.NONE ? '1px' : '2px'
  let borderColor
  switch (mediaItem?.action) {
    case CONCEPT.MEDIA_ADD:
      borderColor = theme.concept.color.clean
      break
    case CONCEPT.MEDIA_EDIT:
      borderColor = theme.palette.primary.main
      break
    case CONCEPT.MEDIA_DELETE:
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
      case CONCEPT.NONE:
        mediaItemEdits = null
        break
      case CONCEPT.MEDIA_ADD:
        mediaItemEdits = editingItem
        break
      case CONCEPT.MEDIA_DELETE:
        mediaItemEdits = pickFields(initial[editingIndex], MEDIA_DISPLAY_FIELDS)
        break
      case CONCEPT.MEDIA_EDIT: {
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
  switch (editingItem.action) {
    case CONCEPT.NONE:
      return null

    case CONCEPT.MEDIA_ADD:
      return [mediaIndex, `${mediaIndex}: Add`, null, mediaItemFields(editingItem)]

    case CONCEPT.MEDIA_DELETE:
      return [mediaIndex, `${mediaIndex}: Delete`, mediaItemFields(initialItem), null]

    case CONCEPT.MEDIA_EDIT:
      return [
        mediaIndex,
        `${mediaIndex}: Edit`,
        mediaItemFields(initialItem),
        mediaItemFields(editingItem),
      ]
  }
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

const mediaState = media => {
  const primaryMedia = getPrimary(media)
  const otherMedia = media.filter(mediaItem => mediaItem.url !== primaryMedia?.url)
  const orderedMedia = primaryMedia ? [primaryMedia, ...otherMedia] : otherMedia

  return orderedMedia.map(mediaItem => ({
    ...mediaItem,
    action: CONCEPT.NONE,
  }))
}

export {
  getPrimary,
  hasPrimary,
  isPrimary,
  mediaBorder,
  mediaEdits,
  mediaItemEdits,
  mediaItemFields,
  mediaState,
}
