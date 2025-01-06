import { Box, IconButton } from "@mui/material"

import { MdOutlineAddPhotoAlternate } from "react-icons/md"

const MediaAdd = ({ bgColor, marginTop, onClick }) => {
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
        onClick={onClick}
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
        <MdOutlineAddPhotoAlternate size={28} />
      </IconButton>
    </Box>
  )
}

export default MediaAdd
