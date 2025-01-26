import { use, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import MediaAdd from "./editMedia/add/MediaAdd"
import MediaDelete from "./editMedia/delete/MediaDelete"
import MediaEdit from "./editMedia/edit/MediaEdit"
import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaSwiper from "./MediaSwiper"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaView = ({ media }) => {
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
          <MediaDelete
            mediaIndex={mediaIndex}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          />
        )}
        {allowEditDelete && (
          <MediaEdit
            mediaIndex={mediaIndex}
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
            mediaIndex={mediaIndex - 1}
            sx={{
              ml: -10,
              mt: 1,
            }}
          />
        )}
        {editing && (
          <MediaAdd
            bgColor={theme.palette.background.paperLight}
            mediaIndex={mediaIndex + 1}
            sx={{
              ml: 10,
              mt: 1,
            }}
          />
        )}
      </Box>
    </>
  )
}

export default MediaView
