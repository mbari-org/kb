const getPrimary = media => {
  if (media.length === 0) {
    return null
  }
  let primaryMedia = media.find(mediaItem => /.*_01\..*/.test(mediaItem.url))
  if (primaryMedia) {
    return primaryMedia
  }
  return media.find(mediaItem => mediaItem.isPrimary)
}

export { getPrimary }
