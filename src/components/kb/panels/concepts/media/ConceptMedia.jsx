import { useCallback, useEffect, useRef, useState } from "react"

import { Box } from "@mui/material"

import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaSwiper from "./MediaSwiper"

const ConceptMedia = ({ concept, sx }) => {
  const [media, setMedia] = useState(null)
  const [mediaIndex, setMediaIndex] = useState(0)

  const mediaDisplayRef = useRef(null)
  const [swiperHeight, setSwiperHeight] = useState("auto")

  const [previewImage, setPreviewImage] = useState(false)

  const openPreview = () => setPreviewImage(true)
  const closePreview = () => setPreviewImage(false)

  const orderMedia = useCallback(concept => {
    const primaryMedia = concept.media.filter(
      conceptMedia => conceptMedia.isPrimary
    )
    const otherMedia = concept.media.filter(
      conceptMedia => !conceptMedia.isPrimary
    )
    return [...primaryMedia, ...otherMedia]
  }, [])

  const mediaSrc = () => (0 < media?.length ? media[mediaIndex]?.url : null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const orderedMedia = orderMedia(concept)
      setMedia(orderedMedia)
    }, 500)

    return () => clearTimeout(timer)
  }, [concept, orderMedia])

  useEffect(() => {
    if (mediaDisplayRef.current) {
      const width = mediaDisplayRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [media])

  return (
    <Box sx={sx}>
      {0 < media?.length && (
        <Box ref={mediaDisplayRef} sx={{ mb: "2px" }}>
          <MediaDisplay mediaSrc={mediaSrc()} openPreview={openPreview} />
          <MediaPreview
            closePreview={closePreview}
            mediaSrc={mediaSrc()}
            previewImage={previewImage}
          />
        </Box>
      )}
      {1 < media?.length && (
        <MediaSwiper
          media={media}
          height={swiperHeight}
          setMediaIndex={setMediaIndex}
        />
      )}
    </Box>
  )
}

export default ConceptMedia
