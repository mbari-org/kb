import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem =>
  mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

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

const mediaBorder = (mediaItem, theme) => {
  const borderWidth = mediaItem.action === CONCEPT.NONE ? "1px" : "2px"
  let borderColor
  switch (mediaItem.action) {
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

export { getPrimary, hasPrimary, isPrimary, mediaBorder, mediaState }
