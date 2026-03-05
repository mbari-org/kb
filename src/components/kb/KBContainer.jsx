import { use, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { puid } from 'puid-js'
import { useErrorBoundary } from 'react-error-boundary'

import AppModal from '@/components/modal/AppModal'
import KnowledgeBase from '@/components/kb/KnowledgeBase'

import AppModalProvider from '@/contexts/app/AppModalProvider'
import ConceptModalProvider from '@/contexts/panels/concepts/modal/ConceptModalProvider'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import PanelDataProvider from '@/contexts/panel/data/PanelDataProvider'
import PreferencesProvider from '@/contexts/preferences/PreferencesProvider'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'
import UsersProvider from '@/contexts/panels/users/UsersProvider'
import RefreshContext from '@/contexts/refresh/RefreshContext'
import UserContext from '@/contexts/user/UserContext'
import { createError } from '@/lib/errors'

const KBContainer = () => {
  const { showBoundary } = useErrorBoundary()
  const { savePreferencesRef } = use(UserContext)

  const id24 = useMemo(() => {
    const { generator, error } = puid({ bits: 24 })
    if (error) throw error
    return generator
  }, [])

  const [refreshKey, setRefreshKey] = useState(() => id24())
  const refreshValue = useMemo(() => ({
    refresh: async () => {
      if (savePreferencesRef.current) {
        try {
          await savePreferencesRef.current()
        } catch (error) {
          showBoundary(
            createError(
              'Preferences Save Error',
              'Failed to save preferences on refresh',
              { action: 'refresh' },
              error
            )
          )
          return
        }
      }
      setRefreshKey(id24())
    },
  }), [id24, savePreferencesRef, showBoundary])

  return (
    <Box sx={{ height: '100vh' }}>
      <AppModalProvider>
        <RefreshContext value={refreshValue}>
          <TaxonomyProvider key={refreshKey}>
            <PreferencesProvider>
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
            </PreferencesProvider>
          </TaxonomyProvider>
        </RefreshContext>
        <AppModal />
      </AppModalProvider>
    </Box>
  )
}

export default KBContainer
