import Box from '@mui/material/Box'

import KnowledgeBase from '@/components/kb/KnowledgeBase'
import AppModal from '@/components/modal/AppModal'

import AppModalProvider from '@/contexts/app/AppModalProvider'
import ConceptModalProvider from '@/contexts/panels/concepts/modal/ConceptModalProvider'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import PanelDataProvider from '@/contexts/panel/data/PanelDataProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'
import UsersProvider from '@/contexts/panels/users/UsersProvider'

const KBContainer = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <AppModalProvider>
        <TaxonomyProvider>
          <SelectedProvider>
            <UsersProvider>
              <PanelDataProvider>
                <ConceptModalProvider>
                  <ConceptProvider>
                    <KnowledgeBase />
                  </ConceptProvider>
                </ConceptModalProvider>
              </PanelDataProvider>
            </UsersProvider>
          </SelectedProvider>
        </TaxonomyProvider>
        <AppModal />
      </AppModalProvider>
    </Box>
  )
}

export default KBContainer
