import { use } from "react"
import { Box, IconButton } from "@mui/material"

import { MdOutlineAddPhotoAlternate } from "react-icons/md"

import ConceptContext from "@/contexts/concept/ConceptContext"
import { MEDIA_STATE } from "@/lib/kb/concept/media"

const MediaAdd = ({ bgColor, mediaIndex, sx }) => {
  const { displayEditMedia } = use(ConceptContext)

  return (
    <Box
      sx={{
        ...sx,
        left: "50%",
        position: "absolute",
        top: 0,
        transform: "translateX(-50%)",
        zIndex: 1,
      }}
    >
      <IconButton
        onClick={() => displayEditMedia(MEDIA_STATE.ADD, mediaIndex)}
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
