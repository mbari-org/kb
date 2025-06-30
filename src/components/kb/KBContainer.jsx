import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'

import AppModalProvider from '@/contexts/modal/AppModalProvider'
import PanelModalProvider from '@/contexts/modal/PanelModalProvider'
import KBDataProvider from '@/contexts/kbData/KBDataProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'

const KBContainer = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <TaxonomyProvider>
        <SelectedProvider>
          <KBDataProvider>
            <AppModalProvider>
              <ConceptProvider>
                <PanelModalProvider>
                  <KnowledgeBase />
                </PanelModalProvider>
              </ConceptProvider>
            </AppModalProvider>
          </KBDataProvider>
        </SelectedProvider>
      </TaxonomyProvider>
    </Box>
  )
}

export default KBContainer
