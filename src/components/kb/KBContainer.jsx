import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'

import AppModalProvider from '@/contexts/modal/AppModalProvider'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import KBDataProvider from '@/contexts/KBDataProvider'
import PanelModalProvider from '@/contexts/modal/PanelModalProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'

const KBContainer = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <AppModalProvider>
        <KBDataProvider>
          <TaxonomyProvider>
            <SelectedProvider>
              <ConceptProvider>
                <PanelModalProvider>
                  <KnowledgeBase />
                </PanelModalProvider>
              </ConceptProvider>
            </SelectedProvider>
          </TaxonomyProvider>
        </KBDataProvider>
      </AppModalProvider>
    </Box>
  )
}

export default KBContainer
