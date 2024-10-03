import { use, useEffect, useState } from "react"

import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"

import Concept from "@/components/kb/panels/concepts/Concept"
import TaxonomyTree from "@/components/kb/panels/concepts/TaxonomyTree"

import StatusContext from "@/contexts/status/StatusContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const VerticalLine = styled(Box)(({ theme }) => ({
  width: 8,
  backgroundColor: theme.palette.divider,
  minHeight: "100vh",
}))

const Concepts = () => {
  const { taxonomy, loadConcept } = use(TaxonomyContext)
  const { status } = use(StatusContext)

  const [concept, setConcept] = useState(null)

  console.log("CxDebug Concepts taxonomy:", taxonomy)
  console.log("CxDebug Concepts status", status)
  // console.log("CxDebug Concepts concept", concept)

  useEffect(() => {
    setConcept(taxonomy[status.concept])
  }, [status, taxonomy])

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ width: 240, overflowY: "auto", pl: 1, pt: 1 }}>
        <TaxonomyTree concept={concept} />
      </Box>
      <VerticalLine />
      <Box sx={{ flexGrow: 1, overflowY: "auto", pl: 1 }}>
        <Concept />
      </Box>
    </Box>
  )
}

export default Concepts
