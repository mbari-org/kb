import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

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

const mediaUpdate = (initial, pending) => 
  ["url", "credits", "caption", "isPrimary"].map(key => 
    pending[key] !== initial[key] ? [key, {initial: initial[key], pending: pending[key]}] : null
  )

const mediaUpdates = (initial, pending) => 
  pending.map((pendingItem, pendingIndex) => {
    switch (pendingItem.action) {
      case CONCEPT.NONE:
        return null
      case CONCEPT.MEDIA_ADD:
        return [pendingItem.url, {initial: null, pending: pendingItem.url}]
      case CONCEPT.MEDIA_DELETE:
        return [pendingItem.url, {initial: pendingItem.url, pending: null}]
      case CONCEPT.MEDIA_EDIT:
        return mediaUpdate(initial[pendingIndex], pendingItem)
      default:
        return null
    }
  })


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


export { getPrimary, hasPrimary, isPrimary, mediaBorder, mediaState, mediaUpdates }
