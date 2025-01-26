import { use } from "react"
import { Box, IconButton } from "@mui/material"

import { MdOutlineAddPhotoAlternate } from "react-icons/md"

import ConceptContext from "@/contexts/concept/ConceptContext"
import { MEDIA_ACTIONS } from "@/contexts/concept/lib/useDisplayEditMedia"

const MediaAdd = ({ bgColor, marginTop, mediaIndex }) => {
  const { displayEditMedia } = use(ConceptContext)

  return (
    <Box
      sx={{
        left: "50%",
        marginTop: marginTop,
        position: "absolute",
        top: 0,
        transform: "translateX(-50%)",
        zIndex: 1,
      }}
    >
      <IconButton
        onClick={() => displayEditMedia(MEDIA_ACTIONS.ADD, mediaIndex)}
        color="main"
        sx={{
          backgroundColor: bgColor,
          "&:hover": {
            backgroundColor: `${bgColor} !important`,
            transform: "scale(1.25)",
          },
          padding: 0.5,
        }}
      >
        <MdOutlineAddPhotoAlternate size={24} />
      </IconButton>
    </Box>
  )
}

export default MediaAdd
