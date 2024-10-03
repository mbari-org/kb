import { use, useEffect, useState } from "react"

import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"

import Concept from "@/components/concepts/Concept"
import ConceptsTree from "@/components/concepts/ConceptsTree"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import UserContext from "@/contexts/user/UserContext"

const VerticalLine = styled(Box)(({ theme }) => ({
  width: 8,
  backgroundColor: theme.palette.divider,
  minHeight: "100vh",
}))

const Concepts = () => {
  const { taxonomy, loadConcept } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const [concept, setConcept] = useState(null)

  console.log("taxonomy:", taxonomy)
  console.log("user", user)
  console.log("concept", concept)

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
