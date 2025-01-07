import { use, useCallback, useEffect, useState, useMemo } from "react"
import { Box } from "@mui/material"

import MediaView from "./MediaView"
import NoMedia from "./NoMedia"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptMedia = () => {
  const {
    conceptState: { media: conceptStateMedia },
    pendingHistory,
  } = use(ConceptContext)

  const [conceptMedia, setConceptMedia] = useState(null)

  const orderedMedia = useMemo(() => {
    const primaryMedia = conceptStateMedia.filter(media => media.isPrimary)
    const otherMedia = conceptStateMedia.filter(media => !media.isPrimary)
    return [...primaryMedia, ...otherMedia]
  }, [conceptStateMedia])

  const isPendingMedia = useCallback(
    (action, actionField, value) => {
      return pendingHistory?.find(
        pending =>
          pending.field === "Media" &&
          pending.action === action &&
          pending[actionField] === value
      )
    },
    [pendingHistory]
  )

  useEffect(() => {
    const preppedMedia = orderedMedia.map(media => {
      let action = "None"
      if (isPendingMedia("DELETE", "oldValue", media.url)) {
        action = "Delete"
      } else if (isPendingMedia("ADD", "newValue", media.url)) {
        action = "Add"
      }
      return { ...media, action }
    })
    const timer = setTimeout(() => {
      setConceptMedia(preppedMedia)
    }, 250)

    return () => clearTimeout(timer)
  }, [isPendingMedia, orderedMedia, pendingHistory])

  const addMedia = newMedia => {
    const updatedMedia = [...conceptMedia, ...newMedia]
    setConceptMedia(updatedMedia)
  }
  const deleteMedia = mediaIndex => {
    const updatedMedia = [...conceptMedia]
    updatedMedia.splice(mediaIndex, 1)
    setConceptMedia(updatedMedia)
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
      {conceptMedia?.length === 0 && <NoMedia addMedia={addMedia} />}
      {conceptMedia?.length > 0 && (
        <MediaView
          addMedia={addMedia}
          deleteMedia={deleteMedia}
          editMedia={editMedia}
          media={conceptMedia}
          setMedia={setConceptMedia}
        />
      )}
    </Box>
  )
}

export default ConceptMedia
