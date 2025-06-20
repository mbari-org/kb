import { use, useTransition } from 'react'

import { Box } from '@mui/material'

import KbLoading from '@/components/modal/KbLoading'
import KbModal from '@/components/modal/KbModal'
import NavBar from '@/components/kb/nav/NavBar'
import Panel from '@/components/kb/panels/Panel'
import useBrowserBack from '@/components/kb/browserBack/useBrowserBack'

import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const KnowledgeBase = () => {
  const { modal, processing } = use(ModalContext)
  const { panels, select } = use(SelectedContext)

  const [_isPending, startTransition] = useTransition()

  const selectPanel = name => startTransition(() => select({ [SELECTED.PANEL]: name }))

  useBrowserBack()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar selectPanel={selectPanel} />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Panel name={panels.current()} />
      </Box>
      {!processing && modal && <KbModal />}
      {processing && <KbLoading />}
    </Box>
  )
}

export default KnowledgeBase
