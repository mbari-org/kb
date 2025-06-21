import { useState } from 'react'

import Box from '@mui/material/Box'

import Concept from '@/components/kb/panels/concepts/Concept'
import ConceptsPanelDivider from '@/components/kb/panels/concepts/ConceptsPanelDivider'
import ConceptsSidebar from '@/components/kb/panels/concepts/ConceptsSidebar'

const ConceptsPanel = () => {
  const [sidebarWidth, setSidebarWidth] = useState(0)

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ width: sidebarWidth }}>
        <ConceptsSidebar />
      </Box>
      <ConceptsPanelDivider setSidebarWidth={setSidebarWidth} />
      <Box sx={{ flexGrow: 1, overflowY: 'hidden' }}>
        <Concept />
      </Box>
    </Box>
  )
}

export default ConceptsPanel
