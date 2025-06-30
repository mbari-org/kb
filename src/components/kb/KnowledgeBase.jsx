import { use, useTransition } from 'react'

import { Box } from '@mui/material'

import KbLoading from '@/components/modal/KbLoading'
import PanelModal from '@/components/modal/PanelModal'
import NavBar from '@/components/kb/nav/NavBar'
import PanelWrapper from '@/components/kb/panels/PanelWrapper'
import useBrowserBack from '@/components/kb/browserBack/useBrowserBack'

import AppModalContext from '@/contexts/modal/app/AppModalContext'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const KnowledgeBase = () => {
  const { processing: appProcessing } = use(AppModalContext)
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
      {!panelProcessing && panelModal && <PanelModal />}
      {(panelProcessing || appProcessing) && <KbLoading />}
    </Box>
  )
}

export default KnowledgeBase
