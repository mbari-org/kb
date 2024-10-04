import { use, useEffect, useState } from "react"

import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"

import Concept from "@/components/kb/panels/concepts/Concept"
import TaxonomyTree from "@/components/kb/panels/concepts/TaxonomyTree"

import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const VerticalLine = styled(Box)(({ theme }) => ({
  width: 6,
  backgroundColor: theme.palette.divider,
  minHeight: "100vh",
}))

const Concepts = () => {
  const { taxonomy, updateTaxonomy } = use(TaxonomyContext)
  const { selected, updateSelected } = use(SelectedContext)

  const [concept, setConcept] = useState(null)

  const selectConcept = conceptName => {
    updateTaxonomy(conceptName)
    updateSelected({ concept: conceptName })
  }

  useEffect(() => {
    setConcept(taxonomy[selected.concept])
  }, [selected, taxonomy])

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ width: 300, overflowY: "auto", pl: 1, pt: 1 }}>
        <TaxonomyTree
          concept={concept}
          selectConcept={selectConcept}
          taxonomy={taxonomy}
        />
      </Box>
      <VerticalLine />
      <Box sx={{ flexGrow: 1, overflowY: "auto", pl: 1 }}>
        <Concept concept={concept} />
      </Box>
    </Box>
  )
}

export default Concepts
