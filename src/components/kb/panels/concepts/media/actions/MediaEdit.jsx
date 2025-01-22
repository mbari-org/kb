import { Box, IconButton } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { CiEdit } from "react-icons/ci"

const MediaEdit = ({ onClick }) => {
  const theme = useTheme()

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
        onClick={onClick}
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
