import { use, useState } from 'react'

import Box from '@mui/material/Box'

import Concept from '@/components/kb/panels/concepts/Concept'
import ConceptsPanelDivider from '@/components/kb/panels/concepts/ConceptsPanelDivider'
import ConceptsSidebar from '@/components/kb/panels/concepts/ConceptsSidebar'
import ConceptModal from '@/components/modal/ConceptModal'

import ConceptModalContext from '@/contexts/modal/concept/ConceptModalContext'

const Concepts = () => {
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const { modal: conceptModal, processing: conceptProcessing } = use(ConceptModalContext)

  return (
    <>
      <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <Box sx={{ width: sidebarWidth }}>
          <ConceptsSidebar />
        </Box>
        <ConceptsPanelDivider setSidebarWidth={setSidebarWidth} />
        <Box sx={{ flexGrow: 1, overflowY: 'hidden' }}>
          <Concept />
        </Box>
      </Box>
      {!conceptProcessing && conceptModal && <ConceptModal />}
    </>
  )
}

export default Concepts
