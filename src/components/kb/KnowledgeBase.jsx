import { use, useTransition } from 'react'

import { Box } from '@mui/material'

import KbLoading from '@/components/modal/KbLoading'
import KbModal from '@/components/modal/KbModal'
import NavBar from '@/components/kb/nav/NavBar'
import Panel from '@/components/kb/panels/Panel'

import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const KnowledgeBase = () => {
  const { modal, processing } = use(ModalContext)
  const { select, selected } = use(SelectedContext)

  const [_isPending, startTransition] = useTransition()

  const selectPanel = name => {
    if (name !== selected.panel.name) {
      startTransition(() => select({ panel: name }))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar activePanel={selected.panel.name} selectPanel={selectPanel} />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Panel name={selected.panel.name} />
      </Box>
      {!processing && modal && <KbModal />}
      {processing && <KbLoading />}
    </Box>
  )
}

export default KnowledgeBase
