import { use } from "react"
import { Box, Typography } from "@mui/material"

import MediaAddButton from "./MediaAddButton"

import ConceptContext from "@/contexts/concept/ConceptContext"

const NoMedia = ({ addMedia }) => {
  const { editing } = use(ConceptContext)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        position: "relative",
      }}
    >
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
      {editing && (
        <MediaAddButton
          bgColor="transparent"
          marginTop={10}
          onClick={addMedia}
        />
      )}
    </Box>
  )
}

export default NoMedia
