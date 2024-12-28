import { Box, IconButton } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { MdDeleteForever } from "react-icons/md"

const MediaDelete = ({ onClick }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        alignItems: "flex-start",
        backgroundColor: theme.palette.background.paper,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        left: 4,
        position: "absolute",
        top: 4,
        zIndex: 1,
      }}
    >
      <IconButton
        onClick={onClick}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.cancel,
          "&:hover": {
            backgroundColor: `${theme.palette.background.paperLight} !important`,
            transform: "scale(1.1)",
          },
        }}
      >
        <MdDeleteForever size={32} />
      </IconButton>
    </Box>
  )
}

export default MediaDelete
