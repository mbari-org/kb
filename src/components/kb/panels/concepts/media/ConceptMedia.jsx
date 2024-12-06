import { use, useCallback, useEffect, useRef, useState } from "react"

import { Box, Typography } from "@mui/material"

import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaSwiper from "./MediaSwiper"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptMedia = ({ sx }) => {
  const {
    conceptState: { media: conceptMedia },
  } = use(ConceptContext)

  const [media, setMedia] = useState(null)
  const [mediaIndex, setMediaIndex] = useState(0)

  const mediaDisplayRef = useRef(null)
  const [swiperHeight, setSwiperHeight] = useState("auto")

  const [previewImage, setPreviewImage] = useState(false)

  const openPreview = () => setPreviewImage(true)
  const closePreview = () => setPreviewImage(false)

  const orderMedia = useCallback(() => {
    const primaryMedia = conceptMedia.filter(media => media.isPrimary)
    const otherMedia = conceptMedia.filter(media => !media.isPrimary)
    return [...primaryMedia, ...otherMedia]
  }, [conceptMedia])

  const mediaSrc = () => (0 < media?.length ? media[mediaIndex]?.url : null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedia(orderMedia())
    }, 500)

    return () => clearTimeout(timer)
  }, [orderMedia])

  useEffect(() => {
    if (mediaDisplayRef.current) {
      const width = mediaDisplayRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [media])

  return (
    <Box
      sx={[
        sx,
        {
          position: "relative",
          overflow: "hidden",
        },
      ]}
    >
      {media?.length === 0 && (
        <Typography
          variant="h4"
          align="center"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            opacity: 0.2,
            color: "#888",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          No Media
        </Typography>
      )}

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
