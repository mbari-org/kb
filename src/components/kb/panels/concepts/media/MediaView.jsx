import { use, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import MediaAddButton from "./MediaAddButton"
import MediaDeleteButton from "./MediaDeleteButton"
import MediaEditButton from "./MediaEditButton"
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

  const mediaItem = media[mediaIndex]

  const openPreview = () => setPreviewImage(true)
  const closePreview = () => setPreviewImage(false)

  const hasPending = mediaItem.action !== "None"
  const allowEditDelete = editing && !hasPending

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
          hasPending={hasPending}
          openPreview={openPreview}
          previewMedia={mediaItem}
        />
        {!editing && (
          <MediaDisplay
            closePreview={closePreview}
            mediaSrc={mediaItem?.url}
            previewImage={previewImage}
          />
        )}
        {allowEditDelete && (
          <MediaDeleteButton
            onClick={() => deleteMedia(mediaIndex)}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          />
        )}
        {allowEditDelete && (
          <MediaEditButton
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
          <MediaAddButton
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
