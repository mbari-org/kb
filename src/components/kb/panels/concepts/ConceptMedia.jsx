const ConceptMedia = ({ concept }) => {
  const primary = concept.media?.find(media => media.isPrimary)

  if (concept.media.length === 0) {
    return null
  }

  return <img src={primary.url} />
}

export default ConceptMedia
