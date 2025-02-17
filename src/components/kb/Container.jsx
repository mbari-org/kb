import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'

import ConceptProvider from '@/contexts/concept/ConceptProvider'
import ModalProvider from '@/contexts/modal/ModalProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'

const Container = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <ModalProvider>
        <TaxonomyProvider>
          <SelectedProvider>
            <ConceptProvider>
              <KnowledgeBase />
            </ConceptProvider>
          </SelectedProvider>
        </TaxonomyProvider>
      </ModalProvider>
    </Box>
  )
}

export default Container
