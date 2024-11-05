import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const MediaDisplay = ({ media }) => {
  const theme = useTheme()

  return (
    <>
      <Box
        style={{
          width: "100%",
          height: "0",
          paddingBottom: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={media.url}
          alt="Concept Media Display"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "top",
            transform: "translate(-50%, -50%)",
          }}
        />
      </Box>
    </>
  )
}

export default MediaDisplay
