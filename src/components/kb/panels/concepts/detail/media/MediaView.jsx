import { use, useCallback, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import MediaAdd from "./add/MediaAdd"
import MediaDelete from "./delete/MediaDelete"
import MediaEdit from "./edit/MediaEdit"
import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaSwiper from "./MediaSwiper"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaView = () => {
  const theme = useTheme()

  const { editing, editingState } = use(ConceptContext)

  const mediaViewRef = useRef(null)

  const [mediaIndex, setMediaIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState(false)
  const [swiperHeight, setSwiperHeight] = useState("auto")

  const showEditMedia =
    editing && editingState.media[mediaIndex]?.action !== CONCEPT.MEDIA_DELETE

  const handleMediaIndexChange = useCallback(
    mediaIndex => {
      editingState.mediaIndex = mediaIndex
      setMediaIndex(mediaIndex)
    },
    [editingState, setMediaIndex]
  )

  useEffect(() => {
    if (mediaViewRef.current) {
      const width = mediaViewRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [editingState.media])

  useEffect(() => {
    if (editingState.mediaIndex !== mediaIndex) {
      setMediaIndex(editingState.mediaIndex)
    }
  }, [editingState.mediaIndex, mediaIndex])

  return (
    <>
      <Box ref={mediaViewRef} sx={{ position: "relative" }}>
        <MediaPreview
          mediaIndex={mediaIndex}
          setPreviewImage={setPreviewImage}
        />
        <MediaDisplay
          mediaIndex={mediaIndex}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
        />
        {showEditMedia && (
          <>
            <MediaDelete mediaIndex={mediaIndex} />
            <MediaEdit mediaIndex={mediaIndex} />
          </>
        )}
      </Box>
      <Box sx={{ mt: 0.5, position: "relative", overflow: "visible" }}>
        <MediaSwiper
          height={swiperHeight}
          setMediaIndex={handleMediaIndexChange}
        />
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
