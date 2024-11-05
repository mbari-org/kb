import { useCallback, useEffect, useState } from "react"

import MediaDisplay from "./MediaDisplay"

const ConceptMedia = ({ concept }) => {
  const [media, setMedia] = useState(null)
  const [mediaIndex, setMediaIndex] = useState(-1)

  const orderMedia = useCallback(concept => {
    const primaryMedia = concept.media.find(
      conceptMedia => conceptMedia.isPrimary
    )
    const otherMedia = concept.media.filter(
      conceptMedia => conceptMedia.url !== primaryMedia.url
    )
    return [primaryMedia, ...otherMedia]
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const orderedMedia = orderMedia(concept)
      setMedia(orderedMedia)
      0 < orderedMedia.length && setMediaIndex(0)
    }, 500)

    return () => clearTimeout(timer)
  }, [concept, orderMedia])

  return <>{-1 < mediaIndex && <MediaDisplay media={media[mediaIndex]} />}</>
}

export default ConceptMedia
