import { use, useState } from "react"

import Box from "@mui/material/Box"

import Concept from "@/components/kb/panels/concepts/Concept"
import TaxonomySidebar from "@/components/kb/panels/concepts/TaxonomySidebar"

import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import ConceptDivider from "./concepts/ConceptDivider"

const Concepts = () => {
  const { getConcept } = use(TaxonomyContext)
  const { selected } = use(SelectedContext)

  const concept = getConcept(selected.concept)

  const [sidebarWidth, setSidebarWidth] = useState(0)

  if (!concept) {
    return null
  }

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <Box sx={{ width: sidebarWidth }}>
        <TaxonomySidebar concept={concept} />
      </Box>
      <ConceptDivider setSidebarWidth={setSidebarWidth} />
      <Box sx={{ flexGrow: 1, overflowY: "auto", pl: 1 }}>
        <Concept concept={concept} />
      </Box>
    </Box>
  )
}

export default Concepts
