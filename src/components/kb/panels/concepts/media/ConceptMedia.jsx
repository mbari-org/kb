import { use, useCallback, useEffect, useState, useMemo } from "react"
import { Box } from "@mui/material"

import MediaView from "./MediaView"
import NoMedia from "./NoMedia"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptMedia = () => {
  const { editingState, pendingHistory } = use(ConceptContext)

  const [conceptMedia, setConceptMedia] = useState(null)

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
    const preppedMedia = editingState.media.map(mediaItem => {
      let action = "None"
      if (isPendingMedia("DELETE", "oldValue", mediaItem.url)) {
        action = "Delete"
      } else if (isPendingMedia("ADD", "newValue", mediaItem.url)) {
        action = "Add"
      }
      return { ...mediaItem, action }
    })
    const timer = setTimeout(() => {
      setConceptMedia(preppedMedia)
    }, 250)

    return () => clearTimeout(timer)
  }, [editingState, isPendingMedia, pendingHistory])

  return (
    <Box
      sx={{
        flexBasis: "33.33%",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {conceptMedia?.length === 0 && <NoMedia />}
      {conceptMedia?.length > 0 && (
        <MediaView media={conceptMedia} />
        // <MediaView media={conceptMedia} setMedia={setConceptMedia} />
      )}
    </Box>
  )
}

export default ConceptMedia
