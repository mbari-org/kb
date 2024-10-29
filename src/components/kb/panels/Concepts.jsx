import { use } from "react"

import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"

import Concept from "@/components/kb/panels/concepts/Concept"
import TaxonomySidebar from "@/components/kb/panels/concepts/TaxonomySidebar"

import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const Concepts = () => {
  const { getConcept, taxonomy } = use(TaxonomyContext)
  const { selected } = use(SelectedContext)

  const concept = getConcept(selected.concept)

  if (!concept) {
    return null
  }

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <Box sx={{ width: 320 }}>
        <TaxonomySidebar concept={concept} taxonomy={taxonomy} />
      </Box>
      <Divider flexItem orientation="vertical" sx={{ borderRightWidth: 6 }} />
      <Box sx={{ flexGrow: 1, overflowY: "auto", pl: 1 }}>
        <Concept concept={concept} />
      </Box>
    </Box>
  )
}

export default Concepts
