import { use, useTransition } from 'react'

import { Box } from '@mui/material'

import KbLoading from '@/components/modal/KbLoading'
import ConceptModal from '@/components/modal/ConceptModal'
import NavBar from '@/components/kb/nav/NavBar'
import PanelWrapper from '@/components/kb/panels/PanelWrapper'
import useBrowserBack from '@/components/kb/browserBack/useBrowserBack'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const KnowledgeBase = () => {
  const { processing: appProcessing } = use(AppModalContext)
  const { modal: holdModal, processing: holdProcessing } = use(ConceptModalContext)
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
      {holdModal && <ConceptModal />}
      {appProcessing && <KbLoading />}
    </Box>
  )
}

export default KnowledgeBase
