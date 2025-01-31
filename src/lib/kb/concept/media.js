const MEDIA_STATE = {
  ADD: "Add",
  DELETE: "Delete",
  NONE: "None",
  UPDATE: "Update",
}

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
    action: MEDIA_STATE.NONE,
  }))
}

export { getPrimary, hasPrimary, isPrimary, MEDIA_STATE, mediaState }
