import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'

import ConceptProvider from '@/contexts/concept/ConceptProvider'
import ModalProvider from '@/contexts/modal/ModalProvider'
import ReferencesProvider from '@/contexts/references/ReferencesProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'

const KBContainer = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <ModalProvider>
        <TaxonomyProvider>
          <SelectedProvider>
            <ReferencesProvider>
              <ConceptProvider>
                <KnowledgeBase />
              </ConceptProvider>
            </ReferencesProvider>
          </SelectedProvider>
        </TaxonomyProvider>
      </ModalProvider>
    </Box>
  )
}

export default KBContainer
