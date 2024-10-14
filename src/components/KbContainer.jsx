import Box from "@mui/material/Box"

import KnowledgeBase from "@/components/kb/KnowledgeBase"

import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"
import SelectedProvider from "@/contexts/selected/SelectedProvider"

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
