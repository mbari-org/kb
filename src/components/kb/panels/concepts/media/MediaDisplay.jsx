import { Box, Dialog, Typography } from "@mui/material"
import { Zoom } from "@mui/material"

const MediaDisplay = ({ closePreview, mediaSrc, previewImage, caption }) => {
  return (
    <Dialog fullScreen open={previewImage} TransitionComponent={Zoom}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <img
          src={mediaSrc}
          alt="Concept Media Display"
          onClick={closePreview}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        <Typography
          variant="caption"
          align="center"
          sx={{
            display: "block",
            marginTop: 1,
            textAlign: "center",
          }}
        >
          {caption}
        </Typography>
      </Box>
    </Dialog>
  )
}

export default MediaDisplay
