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
      <AppModalProvider>
        <TaxonomyProvider>
          <SelectedProvider>
            <KBDataProvider>
              <ConceptProvider>
                <PanelModalProvider>
                  <KnowledgeBase />
                </PanelModalProvider>
              </ConceptProvider>
            </KBDataProvider>
          </SelectedProvider>
        </TaxonomyProvider>
      </AppModalProvider>
    </Box>
  )
}

export default KBContainer
