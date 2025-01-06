import { use, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import MediaAdd from "./MediaAdd"
import MediaDelete from "./MediaDelete"
import MediaEdit from "./MediaEdit"
import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaSwiper from "./MediaSwiper"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaView = ({ addMedia, deleteMedia, editMedia, media }) => {
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
      <Box ref={mediaViewRef} sx={{ position: "relative" }}>
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
        {editing && (
          <MediaDelete
            onClick={() => deleteMedia(mediaIndex)}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          />
        )}
        {editing && (
          <MediaEdit
            onClick={() => editMedia(mediaIndex)}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          />
        )}
      </Box>
      <Box sx={{ mt: 0.5, position: "relative", overflow: "visible" }}>
        <MediaSwiper
          media={media}
          height={swiperHeight}
          setMediaIndex={setMediaIndex}
        />
        {editing && (
          <MediaAdd
            bgColor={theme.palette.background.paperLight}
            marginTop={1}
            onClick={addMedia}
          />
        )}
      </Box>
    </>
  )
}

export default MediaView
