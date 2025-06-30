import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'
import SystemModal from '@/components/modal/SystemModal'

import SystemModalProvider from '@/contexts/modal/SystemModalProvider'
import ConceptModalProvider from '@/contexts/modal/ConceptModalProvider'
import PanelModalProvider from '@/contexts/modal/PanelModalProvider'
import KBDataProvider from '@/contexts/kbData/KBDataProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'

const KBContainer = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <SystemModalProvider>
        <TaxonomyProvider>
          <SelectedProvider>
            <KBDataProvider>
              <ConceptModalProvider>
                <ConceptProvider>
                  <PanelModalProvider>
                    <KnowledgeBase />
                  </PanelModalProvider>
                </ConceptProvider>
              </ConceptModalProvider>
            </KBDataProvider>
          </SelectedProvider>
        </TaxonomyProvider>
        <SystemModal />
      </SystemModalProvider>
    </Box>
  )
}

export default KBContainer
