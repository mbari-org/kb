import { use, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import AddMedia from "./AddMedia"
import DeleteMedia from "./DeleteMedia"
import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaSwiper from "./MediaSwiper"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaView = ({ media, addMedia, deleteMedia }) => {
  const theme = useTheme()

  const { editing } = use(ConceptContext)

  const mediaViewRef = useRef(null)

  const [mediaIndex, setMediaIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState(false)
  const [swiperHeight, setSwiperHeight] = useState("auto")

  const openPreview = () => setPreviewImage(true)
  const closePreview = () => setPreviewImage(false)

  useEffect(() => {
    if (mediaViewRef.current) {
      const width = mediaViewRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [media])

  return (
    <>
      <Box ref={mediaViewRef}>
        <MediaPreview
          previewMedia={media[mediaIndex]}
          openPreview={openPreview}
        />
        {!editing && (
          <MediaDisplay
            closePreview={closePreview}
            mediaSrc={media[mediaIndex]?.url}
            previewImage={previewImage}
          />
        )}
        {editing && <DeleteMedia onClick={() => deleteMedia(mediaIndex)} />}
      </Box>
      <Box sx={{ mt: 0.5, position: "relative", overflow: "visible" }}>
        <MediaSwiper
          media={media}
          height={swiperHeight}
          setMediaIndex={setMediaIndex}
        />
        {editing && (
          <AddMedia
            bgColor={theme.palette.background.paperLight}
            marginTop={4}
            onClick={addMedia}
          />
        )}
      </Box>
    </>
  )
}

export default MediaView
