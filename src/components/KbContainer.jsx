import Box from "@mui/material/Box"

import KnowledgeBase from "@/components/kb/KnowledgeBase"

import SelectedProvider from "@/contexts/selected/SelectedProvider"
import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"

const KbContainer = () => {
  return (
    <Box sx={{ height: "100vh" }}>
      <TaxonomyProvider>
        <SelectedProvider>
          <KnowledgeBase />
        </SelectedProvider>
      </TaxonomyProvider>
    </Box>
  )
}

export default KbContainer
