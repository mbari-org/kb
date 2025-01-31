import { use } from "react"
import { Box, IconButton } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { CiEdit } from "react-icons/ci"

import ConceptContext from "@/contexts/concept/ConceptContext"
import { MEDIA_STATE } from "@/lib/kb/concept/media"

const MediaEdit = ({ mediaIndex }) => {
  const theme = useTheme()

  const { displayEditMedia } = use(ConceptContext)

  return (
    <Box
      sx={{
        alignItems: "flex-start",
        backgroundColor: theme.palette.background.paper,
        bottom: 28,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        right: 2,
        position: "absolute",
        zIndex: 1,
      }}
    >
      <IconButton
        onClick={() => displayEditMedia(MEDIA_STATE.EDIT, mediaIndex)}
        color="main"
        sx={{
          backgroundColor: theme.palette.background.paper,
          "&:hover": {
            backgroundColor: `${theme.palette.background.paperLight} !important`,
            transform: "scale(1.25)",
          },
          padding: 0.5,
        }}
      >
        <CiEdit size={28} />
      </IconButton>
    </Box>
  )
}

export default MediaEdit
