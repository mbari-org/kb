import Box from "@mui/material/Box"

import KnowledgeBase from "@/components/kb/KnowledgeBase"

import LoadingProvider from "@/contexts/loading/LoadingProvider"
import SelectedProvider from "@/contexts/selected/SelectedProvider"
import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"

const KbContainer = () => {
  return (
    <Box sx={{ height: "100vh" }}>
      <LoadingProvider>
        <TaxonomyProvider>
          <SelectedProvider>
            <KnowledgeBase />
          </SelectedProvider>
        </TaxonomyProvider>
      </LoadingProvider>
    </Box>
  )
}

export default KbContainer
