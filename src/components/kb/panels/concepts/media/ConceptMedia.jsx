import { use, useCallback, useEffect, useState } from "react"
import { Box } from "@mui/material"

import MediaView from "./MediaView"
import NoMedia from "./NoMedia"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptMedia = () => {
  const {
    conceptState: { media: conceptMedia },
  } = use(ConceptContext)

  const [media, setMedia] = useState(null)

  const orderMedia = useCallback(() => {
    const primaryMedia = conceptMedia.filter(media => media.isPrimary)
    const otherMedia = conceptMedia.filter(media => !media.isPrimary)
    return [...primaryMedia, ...otherMedia]
  }, [conceptMedia])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedia(orderMedia())
    }, 250)

    return () => clearTimeout(timer)
  }, [orderMedia])

  const addMedia = newMedia => {
    const updatedMedia = [...media, ...newMedia]
    setMedia(updatedMedia)
  }
  const deleteMedia = mediaIndex => {
    const updatedMedia = [...media]
    updatedMedia.splice(mediaIndex, 1)
    setMedia(updatedMedia)
  }

  const editMedia = _media => {
    // const updatedMedia = [...media, ...newMedia]
    // setMedia(media)
  }

  return (
    <Box
      sx={{
        flexBasis: "33.33%",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {media?.length === 0 && <NoMedia addMedia={addMedia} />}
      {media?.length > 0 && (
        <MediaView
          addMedia={addMedia}
          deleteMedia={deleteMedia}
          editMedia={editMedia}
          media={media}
          setMedia={setMedia}
        />
      )}
    </Box>
  )
}

export default ConceptMedia
