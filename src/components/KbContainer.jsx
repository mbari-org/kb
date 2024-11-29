import Box from "@mui/material/Box"

import KnowledgeBase from "@/components/kb/KnowledgeBase"

import ModalProvider from "@/contexts/modal/ModalProvider"
import SelectedProvider from "@/contexts/selected/SelectedProvider"
import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"

const KbContainer = () => {
  return (
    <Box sx={{ height: "100vh" }}>
      <ModalProvider>
        <TaxonomyProvider>
          <SelectedProvider>
            <KnowledgeBase />
          </SelectedProvider>
        </TaxonomyProvider>
      </ModalProvider>
    </Box>
  )
}

export default KbContainer
