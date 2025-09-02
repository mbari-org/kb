import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { puid } from 'puid-js'

import AppModal from '@/components/modal/AppModal'
import KnowledgeBase from '@/components/kb/KnowledgeBase'

import AppModalProvider from '@/contexts/app/AppModalProvider'
import ConceptModalProvider from '@/contexts/panels/concepts/modal/ConceptModalProvider'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import PanelDataProvider from '@/contexts/panel/data/PanelDataProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'
import UsersProvider from '@/contexts/panels/users/UsersProvider'
import RefreshContext from '@/contexts/refresh/RefreshContext'

const KBContainer = () => {
  const id24 = useMemo(() => {
    const { generator, error } = puid({ bits: 24 })
    if (error) throw error
    return generator
  }, [])

  const [refreshKey, setRefreshKey] = useState(() => id24())
  const refreshValue = useMemo(() => ({ refresh: () => setRefreshKey(id24()) }), [id24])

  return (
    <Box sx={{ height: '100vh' }}>
      <AppModalProvider>
        <RefreshContext value={refreshValue}>
          <TaxonomyProvider key={refreshKey}>
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
        </RefreshContext>
        <AppModal />
      </AppModalProvider>
    </Box>
  )
}

export default KBContainer
