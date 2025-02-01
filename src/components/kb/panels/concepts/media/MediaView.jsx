import { use, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import MediaAdd from "./editMedia/MediaAdd"
import MediaDelete from "./editMedia/MediaDelete"
import MediaEdit from "./editMedia/MediaEdit"
import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaSwiper from "./MediaSwiper"

import { CONCEPT_STATE } from "@/contexts/concept/lib/conceptStateReducer"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaView = ({ media }) => {
  const theme = useTheme()

  const { editing } = use(ConceptContext)

  const mediaViewRef = useRef(null)

  const [mediaIndex, setMediaIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState(false)
  const [swiperHeight, setSwiperHeight] = useState("auto")

  const showEditMedia =
    editing && media[mediaIndex]?.action === CONCEPT_STATE.NONE

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
        <MediaSwiper
          height={swiperHeight}
          // media={media}
          setMediaIndex={setMediaIndex}
        />
        {editing && (
          <MediaAdd
            bgColor={theme.palette.background.paperLight}
            mediaIndex={mediaIndex.length}
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
