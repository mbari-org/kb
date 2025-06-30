import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'
import AppModal from '@/components/modal/AppModal'

import PanelDataProvider from '@/contexts/panels/PanelDataProvider'
import PanelModalProvider from '@/contexts/modal/panel/PanelModalProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import AppModalProvider from '@/contexts/modal/app/AppModalProvider'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'

const KBContainer = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <AppModalProvider>
        <TaxonomyProvider>
          <SelectedProvider>
            <PanelDataProvider>
              <PanelModalProvider>
                <ConceptProvider>
                  <KnowledgeBase />
                </ConceptProvider>
              </PanelModalProvider>
            </PanelDataProvider>
          </SelectedProvider>
        </TaxonomyProvider>
        <AppModal />
      </AppModalProvider>
    </Box>
  )
}

export default KBContainer
