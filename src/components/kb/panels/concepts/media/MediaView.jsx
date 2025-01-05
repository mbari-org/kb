import { use, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import AddMedia from "./AddMedia"
import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import DeleteMedia from "./DeleteMedia"
import MediaSwiper from "./MediaSwiper"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaView = ({ media, addMedia, deleteMedia }) => {
  const theme = useTheme()

  const { editing } = use(ConceptContext)

  const mediaDisplayRef = useRef(null)

  const [mediaIndex, setMediaIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState(false)
  const [swiperHeight, setSwiperHeight] = useState("auto")

  const openPreview = () => setPreviewImage(true)
  const closePreview = () => setPreviewImage(false)

  const mediaSrc = 0 < media?.length ? media[mediaIndex]?.url : null

  useEffect(() => {
    if (mediaDisplayRef.current) {
      const width = mediaDisplayRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [media])

  return (
    <>
      <Box ref={mediaDisplayRef}>
        <MediaDisplay mediaSrc={mediaSrc} openPreview={openPreview} />
        {!editing && (
          <MediaPreview
            closePreview={closePreview}
            mediaSrc={mediaSrc}
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
            marginTop={2}
            onClick={addMedia}
          />
        )}
      </Box>
    </>
  )
}

export default MediaView
