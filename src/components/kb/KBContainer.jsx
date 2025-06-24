import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'

import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import KBDataProvider from '@/contexts/KBDataProvider'
import ModalProvider from '@/contexts/modal/ModalProvider'
import ReferencesProvider from '@/contexts/panels/references/ReferencesProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'

const KBContainer = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <ModalProvider>
        <KBDataProvider>
          <TaxonomyProvider>
            <SelectedProvider>
              <ReferencesProvider>
                <ConceptProvider>
                  <KnowledgeBase />
                </ConceptProvider>
              </ReferencesProvider>
            </SelectedProvider>
          </TaxonomyProvider>
        </KBDataProvider>
      </ModalProvider>
    </Box>
  )
}

export default KBContainer
