import { use, useTransition } from 'react'

import { Box } from '@mui/material'

import KbLoading from '@/components/modal/KbLoading'
import KbModal from '@/components/modal/KbModal'
import NavBar from '@/components/kb/nav/NavBar'
import useBrowserBack from '@/components/kb/browserBack/useBrowserBack'

import panelMods from '@/components/kb/panels/modules'

import AppModalContext from '@/contexts/modal/AppModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const KnowledgeBase = () => {
  const { modal, processing } = use(AppModalContext)
  const { panels, select } = use(SelectedContext)

  const [_isPending, startTransition] = useTransition()

  const selectPanel = name => startTransition(() => select({ [SELECTED.PANEL]: name }))

  useBrowserBack()

  const panelComponent = name => {
    const panel = panelMods.find(p => p.name === name)
    return <panel.module id={`kb-panel-${name}`} />
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar selectPanel={selectPanel} />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>{panelComponent(panels.current())}</Box>
      {!processing && modal && <KbModal />}
      {processing && <KbLoading />}
    </Box>
  )
}

export default KnowledgeBase
