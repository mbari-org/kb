import { use, useTransition } from 'react'

import { Box } from '@mui/material'

import KbLoading from '@/components/modal/KbLoading'
import KbModal from '@/components/modal/KbModal'
import NavBar from '@/components/kb/nav/NavBar'
import PanelWrapper from '@/components/kb/panels/PanelWrapper'
import useBrowserBack from '@/components/kb/browserBack/useBrowserBack'

import AppModalContext from '@/contexts/modal/AppModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const KnowledgeBase = () => {
  const { modal, processing } = use(AppModalContext)
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
      {!processing && modal && <KbModal />}
      {processing && <KbLoading />}
    </Box>
  )
}

export default KnowledgeBase
