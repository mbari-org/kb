import { use, useTransition } from 'react'

import { Box } from '@mui/material'

import KbLoading from '@/components/modal/KbLoading'
import HOLDModal from '@/components/modal/HOLDModal'
import NavBar from '@/components/kb/nav/NavBar'
import PanelWrapper from '@/components/kb/panels/PanelWrapper'
import useBrowserBack from '@/components/kb/browserBack/useBrowserBack'

import AppModalContext from '@/contexts/modal/app/AppModalContext'
import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const KnowledgeBase = () => {
  const { processing: appProcessing } = use(AppModalContext)
  const { modal: holdModal, processing: holdProcessing } = use(HOLDModalContext)
  const { modal: panelModal, processing: panelProcessing } = use(PanelModalContext)
  const { panels, updateSelected } = use(SelectedContext)

  const [_isPending, startTransition] = useTransition()

  const selectPanel = name => startTransition(() => updateSelected({ [SELECTED.PANEL]: name }))

  useBrowserBack()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar selectPanel={selectPanel} />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <PanelWrapper activePanel={panels.current()} />
      </Box>
      {!holdProcessing && holdModal && <HOLDModal />}
      {!panelProcessing && panelModal && typeof panelModal === 'function' && panelModal()}
      {(holdProcessing || panelProcessing || appProcessing) && <KbLoading />}
    </Box>
  )
}

export default KnowledgeBase
