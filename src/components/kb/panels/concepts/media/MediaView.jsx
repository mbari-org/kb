import { use, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import MediaAdd from "./editMedia/MediaAdd"
import MediaDelete from "./editMedia/MediaDelete"
import MediaEdit from "./editMedia/MediaEdit"
import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaSwiper from "./MediaSwiper"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaView = () => {
  const theme = useTheme()

  const { concept, editing, editingState } = use(ConceptContext)

  const mediaViewRef = useRef(null)

  const [mediaIndex, setMediaIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState(false)
  const [swiperHeight, setSwiperHeight] = useState("auto")

  const showEditMedia =
    editing && editingState.media[mediaIndex]?.action !== CONCEPT.MEDIA_DELETE

  const openPreview = () => setPreviewImage(true)
  const closePreview = () => setPreviewImage(false)

  useEffect(() => {
    setMediaIndex(0)
  }, [concept])

  useEffect(() => {
    if (mediaViewRef.current) {
      const width = mediaViewRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [editingState.media])

  return (
    <>
      <Box ref={mediaViewRef} sx={{ position: "relative" }}>
        <MediaPreview openPreview={openPreview} mediaIndex={mediaIndex} />
        {!editing && (
          <MediaDisplay
            closePreview={closePreview}
            mediaIndex={mediaIndex}
            previewImage={previewImage}
          />
        )}
        {showEditMedia && (
          <>
            <MediaDelete mediaIndex={mediaIndex} />
            <MediaEdit mediaIndex={mediaIndex} />
          </>
        )}
      </Box>
      <Box sx={{ mt: 0.5, position: "relative", overflow: "visible" }}>
        <MediaSwiper height={swiperHeight} setMediaIndex={setMediaIndex} />
        {editing && (
          <MediaAdd
            bgColor={theme.palette.background.paperLight}
            mediaIndex={editingState.media.length}
            sx={{
              mt: 1,
            }}
          />
        )}
      </Box>
    </>
  )
}

export default MediaView
