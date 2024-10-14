import { use, useEffect } from "react"

import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"

import Concept from "@/components/kb/panels/concepts/Concept"
import ConceptSearch from "@/components/kb/panels/concepts/ConceptSearch"
import TaxonomyTree from "@/components/kb/panels/concepts/tree/TaxonomyTree"

import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const Concepts = () => {
  const { getConcept, taxonomy } = use(TaxonomyContext)
  const { selected, updateConcept } = use(SelectedContext)

  const concept = getConcept(selected.concept)

  if (!concept) {
    return null
  }

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ width: 300, overflowY: "auto", pl: 1, pt: 1 }}>
        <ConceptSearch
          concept={concept}
          names={taxonomy.names}
          selectConcept={updateConcept}
        />
        <TaxonomyTree
          concept={concept}
          selectConcept={updateConcept}
          taxonomy={taxonomy}
        />
      </Box>
      <Divider
        flexItem
        orientation="vertical"
        sx={{ borderRightWidth: 6, minHeight: "100vh" }}
      />
      <Box sx={{ flexGrow: 1, overflowY: "auto", pl: 1 }}>
        <Concept concept={concept} />
      </Box>
    </Box>
  )
}

export default Concepts
