import { Typography } from "@mui/material"

const NoMedia = () => {
  return (
    <Typography
      variant="h4"
      align="center"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(-45deg)",
        opacity: 0.2,
        color: "#888",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      No Media
    </Typography>
  )
}

export default NoMedia
