import { use } from "react"

import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"

import Concept from "@/components/kb/panels/concepts/Concept"
import ConceptSearch from "@/components/kb/panels/concepts/ConceptSearch"
import TaxonomyTree from "@/components/kb/panels/concepts/tree/TaxonomyTree"

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
      <Stack sx={{ width: 320 }}>
        <Box sx={{ ml: 1, mt: 1, mr: 1 }}>
          <ConceptSearch concept={concept} taxonomy={taxonomy} />
        </Box>
        <Box sx={{ overflowY: "auto", ml: 1, mr: 1 }}>
          <TaxonomyTree concept={concept} taxonomy={taxonomy} />
        </Box>
      </Stack>
      <Divider flexItem orientation="vertical" sx={{ borderRightWidth: 6 }} />
      <Box sx={{ flexGrow: 1, overflowY: "auto", pl: 1 }}>
        <Concept concept={concept} />
      </Box>
    </Box>
  )
}

export default Concepts
