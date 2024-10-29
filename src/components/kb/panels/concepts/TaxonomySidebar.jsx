import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import ConceptSearch from "@/components/kb/panels/concepts/ConceptSearch"
import TaxonomyTree from "@/components/kb/panels/concepts/tree/TaxonomyTree"

const TaxonomySidebar = ({ concept, taxonomy }) => {
  return (
    <>
      <Stack sx={{ width: 320 }}>
        <Box sx={{ ml: 1, mt: 1, mr: 1 }}>
          <ConceptSearch concept={concept} taxonomy={taxonomy} />
        </Box>
        <Box sx={{ overflowY: "auto", ml: 1, mr: 1 }}>
          <TaxonomyTree concept={concept} taxonomy={taxonomy} />
        </Box>
      </Stack>
    </>
  )
}

export default TaxonomySidebar
