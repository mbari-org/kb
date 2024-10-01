import Box from "@mui/material/Box"

import Concept from "@/components/concepts/Concept"
import ConceptsTree from "@/components/concepts/ConceptsTree"

import { styled } from "@mui/material/styles"

const VerticalLine = styled(Box)(({ theme }) => ({
  width: 8,
  backgroundColor: theme.palette.divider,
  minHeight: "100vh",
}))

const Concepts = () => {
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ width: 240, overflowY: "auto", pl: 1, pt: 1 }}>
        <ConceptsTree />
      </Box>
      <VerticalLine />
      <Box sx={{ flexGrow: 1, overflowY: "auto", pl: 1 }}>
        <Concept />
      </Box>
    </Box>
  )
}

export default Concepts
