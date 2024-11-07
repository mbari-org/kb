import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const MediaDisplay = ({ mediaSrc, openPreview }) => {
  const theme = useTheme()

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "0",
          paddingBottom: "100%",
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${theme.palette.grey[300]}`,
        }}
      >
        <img
          src={mediaSrc}
          alt="Concept Has No Media"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            transform: "translate(-50%, -50%)",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          onClick={openPreview}
        />
      </Box>
    </>
  )
}

export default MediaDisplay
