import { useState } from "react"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import ConceptSearch from "@/components/kb/panels/concepts/ConceptSearch"
import TaxonomyTree from "@/components/kb/panels/concepts/tree/TaxonomyTree"

const TaxonomySidebar = ({ concept, taxonomy }) => {
  const [autoExpand, setAutoExpand] = useState(null)

  return (
    <>
      <Stack sx={{ width: 320 }}>
        <Box sx={{ ml: 1, mt: 1, mr: 1 }}>
          <ConceptSearch
            concept={concept}
            setAutoExpand={setAutoExpand}
            taxonomy={taxonomy}
          />
        </Box>
        <Box sx={{ overflowY: "auto", ml: 1, mr: 1 }}>
          <TaxonomyTree
            autoExpand={autoExpand}
            concept={concept}
            setAutoExpand={setAutoExpand}
            taxonomy={taxonomy}
          />
        </Box>
      </Stack>
    </>
  )
}

export default TaxonomySidebar
