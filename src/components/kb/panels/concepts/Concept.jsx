import { Box, Button, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptViewToggle from "./ConceptViewToggle"
import ConceptMedia from "./media/ConceptMedia"

const Concept = ({ concept }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", p: 1.5, width: "100%" }}>
        <Box sx={{ flexBasis: "33.33%", flexShrink: 0, overflow: "hidden" }}>
          <ConceptMedia concept={concept} />
        </Box>
        <Box sx={{ flex: "1", textAlign: "left" }}>
          <Typography
            sx={{
              color: theme.palette.concept.color,
              fontFamily: theme.palette.concept.fontFamily,
              fontSize: theme.palette.concept.fontSize,
              fontWeight: theme.palette.concept.fontWeight,
              ml: 1,
            }}
          >
            {concept.name.toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ flex: "0 0 auto", marginLeft: "auto" }}>
          <ConceptViewToggle />
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 60,
          left: 10,
          right: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" color="primary">
          Edit
        </Button>
        <Button variant="contained" color="secondary" disabled>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default Concept
