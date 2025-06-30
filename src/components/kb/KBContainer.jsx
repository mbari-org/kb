import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'
import SystemModal from '@/components/modal/SystemModal'

import ConceptModalProvider from '@/contexts/modal/concept/ConceptModalProvider'
import KBDataProvider from '@/contexts/kbData/KBDataProvider'
import PanelModalProvider from '@/contexts/modal/panel/PanelModalProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import SystemModalProvider from '@/contexts/modal/app/SystemModalProvider'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'

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
