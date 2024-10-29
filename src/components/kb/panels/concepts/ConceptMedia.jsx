import { useEffect, useState } from "react"

const ConceptMedia = ({ concept }) => {
  const [showMedia, setShowMedia] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMedia(0 < concept.media.length)
    }, 250)

    return () => clearTimeout(timer)
  }, [concept])

  const primaryMedia = concept.media?.find(media => media.isPrimary)

  return (
    <>
      {showMedia && primaryMedia && (
        <img src={primaryMedia.url} alt="Primary Media" />
      )}
    </>
  )
}

export default ConceptMedia
