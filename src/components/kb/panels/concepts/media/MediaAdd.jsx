import { Box, IconButton } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { MdAddPhotoAlternate } from "react-icons/md"

const MediaAdd = ({ onClick }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        left: "50%",
        marginTop: 2,
        position: "absolute",
        top: 0,
        transform: "translateX(-50%)",
        zIndex: 1,
      }}
    >
      <IconButton
        onClick={onClick}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: `${theme.palette.background.paperLight} !important`,
            transform: "scale(1.1)",
          },
        }}
      >
        <MdAddPhotoAlternate size={28} />
      </IconButton>
    </Box>
  )
}

export default MediaAdd
