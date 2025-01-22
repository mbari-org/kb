import { use, useCallback, useEffect, useState, useMemo } from "react"
import { Box } from "@mui/material"

import MediaView from "./MediaView"
import NoMedia from "./NoMedia"

import ConceptContext from "@/contexts/concept/ConceptContext"

import useMediaActions from "./actions/useMediaActions"

const ConceptMedia = () => {
  const {
    editingState: { media: mediaEditingState },
    pendingHistory,
  } = use(ConceptContext)

  const [conceptMedia, setConceptMedia] = useState(null)

  const orderedMedia = useMemo(() => {
    const primaryMedia = mediaEditingState.filter(media => media.isPrimary)
    const otherMedia = mediaEditingState.filter(media => !media.isPrimary)
    return [...primaryMedia, ...otherMedia]
  }, [mediaEditingState])

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

  const { addMedia, deleteMedia, editMedia } = useMediaActions()

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
        <MediaView media={conceptMedia} setMedia={setConceptMedia} />
      )}
    </Box>
  )
}

export default ConceptMedia
