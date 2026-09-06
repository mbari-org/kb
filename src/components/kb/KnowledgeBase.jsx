import { use, useTransition } from 'react'

import { Box } from '@mui/material'

import KbLoading from '@/components/modal/KbLoading'
import ConceptModal from '@/components/modal/ConceptModal'
import NavBar from '@/components/kb/nav/NavBar'
import Panels from '@/components/kb/Panels'
import useBrowserBack from '@/components/kb/browserBack/useBrowserBack'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'

const KnowledgeBase = () => {
  const { processing: appProcessing } = use(AppModalContext)
  const { modal: holdModal } = use(ConceptModalDataContext)
  const { updateSelected } = use(SelectedContext)

  const [_isPending, startTransition] = useTransition()

  const selectPanel = name => startTransition(() => updateSelected({ [SELECTED.PANEL]: name }))

  useBrowserBack()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavBar selectPanel={selectPanel} />
      <Panels />
      {holdModal && <ConceptModal />}
      {appProcessing && <KbLoading />}
    </Box>
  )
}

export default KnowledgeBase
