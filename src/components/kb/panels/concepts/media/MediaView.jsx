// src/components/kb/panels/concepts/media/MediaView.jsx

import { use, useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"

import MediaAdd from "./MediaAdd"
import MediaDisplay from "./MediaDisplay"
import MediaPreview from "./MediaPreview"
import MediaDelete from "./MediaDelete"
import MediaSwiper from "./MediaSwiper"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaView = ({ media, setMedia }) => {
  const {
    // conceptState: { media: conceptMedia },
    editing,
  } = use(ConceptContext)

  const mediaDisplayRef = useRef(null)

  const [mediaIndex, setMediaIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState(false)
  const [swiperHeight, setSwiperHeight] = useState("auto")

  const openPreview = () => setPreviewImage(true)
  const closePreview = () => setPreviewImage(false)

  const handleMediaDelete = () => {
    const updatedMedia = [...media]
    updatedMedia.splice(mediaIndex, 1)
    setMedia(updatedMedia)
  }

  const handleMediaAdd = newMedia => {
    const updatedMedia = [...media, ...newMedia]
    setMedia(updatedMedia)
  }

  const mediaSrc = () => (0 < media?.length ? media[mediaIndex]?.url : null)

  useEffect(() => {
    if (mediaDisplayRef.current) {
      const width = mediaDisplayRef.current.offsetWidth
      setSwiperHeight(`${width / 4}px`)
    }
  }, [media])

  return (
    <>
      <Box ref={mediaDisplayRef}>
        <MediaDisplay mediaSrc={mediaSrc()} openPreview={openPreview} />
        {!editing && (
          <MediaPreview
            closePreview={closePreview}
            mediaSrc={mediaSrc()}
            previewImage={previewImage}
          />
        )}
        {editing && <MediaDelete onClick={handleMediaDelete} />}
      </Box>
      <Box sx={{ mt: 0.5, position: "relative", overflow: "visible" }}>
        <MediaSwiper
          media={media}
          height={swiperHeight}
          setMediaIndex={setMediaIndex}
        />
        {editing && <MediaAdd onClick={handleMediaAdd} />}
      </Box>
    </>
  )
}

export default MediaView
