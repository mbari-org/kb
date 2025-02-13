import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

import { pickFields } from "@/lib/util"

const MEDIA_DISPLAY_FIELDS = ["url", "credit", "caption", "isPrimary"]

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem =>
  mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaBorder = (mediaItem, theme) => {
  const borderWidth = mediaItem?.action === CONCEPT.NONE ? "1px" : "2px"
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

const mediaEdits = (initial, pending) =>
  pending.map((pendingItem, pendingIndex) => {
    let mediaItemEdits
    switch (pendingItem.action) {
      case CONCEPT.NONE:
        mediaItemEdits = null
        break
      case CONCEPT.MEDIA_ADD:
        mediaItemEdits = pendingItem
        break
      case CONCEPT.MEDIA_DELETE:
        mediaItemEdits = pickFields(initial[pendingIndex], MEDIA_DISPLAY_FIELDS)
        break
      case CONCEPT.MEDIA_EDIT: {
        const initialItem = initial[pendingIndex]
        mediaItemEdits = MEDIA_DISPLAY_FIELDS.reduce((edits, field) => {
          if (pendingItem[field] !== initial[pendingIndex][field]) {
            edits.push([
              field,
              { initial: initialItem[field], pending: pendingItem[field] },
            ])
          }
          return edits
        }, [])

        break
      }
      default:
        mediaItemEdits = null
        break
    }
    return { action: pendingItem.action, mediaItemEdits }
  })

const mediaItemEdit = (mediaIndex, initialItem, pendingItem) => {
  switch (pendingItem.action) {
    case CONCEPT.NONE:
      return null

    case CONCEPT.MEDIA_ADD:
      return [
        mediaIndex,
        `${mediaIndex}: Add`,
        null,
        mediaItemFields(pendingItem),
      ]

    case CONCEPT.MEDIA_DELETE:
      return [
        mediaIndex,
        `${mediaIndex}: Delete`,
        mediaItemFields(initialItem),
        null,
      ]

    case CONCEPT.MEDIA_EDIT:
      return [
        mediaIndex,
        `${mediaIndex}: Edit`,
        mediaItemFields(initialItem),
        mediaItemFields(pendingItem),
      ]
  }
}

const mediaItemEdits = (initial, pending) =>
  pending.map((pendingItem, pendingIndex) => {
    const initialItem = initial[pendingIndex]
    return mediaItemEdit(pendingIndex, initialItem, pendingItem)
  })

const mediaItemFields = mediaItem =>
  MEDIA_DISPLAY_FIELDS.reduce((fields, field) => {
    fields.push([field, mediaItem[field]])
    return fields
  }, [])

const mediaState = media => {
  const primaryMedia = getPrimary(media)
  const otherMedia = media.filter(
    mediaItem => mediaItem.url !== primaryMedia?.url
  )
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
