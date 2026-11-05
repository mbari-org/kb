import { useState } from 'react'

import Box from '@mui/material/Box'

import Concept from '@/components/kb/panels/concepts/Concept'
import ConceptsPanelDivider from '@/components/kb/panels/concepts/ConceptsPanelDivider'
import ConceptsSidebar from '@/components/kb/panels/concepts/sidebar/ConceptsSidebar'

const Concepts = () => {
  const [sidebarWidth, setSidebarWidth] = useState(0)

  return (
    <Box sx={{ display: 'flex', height: '100%', minHeight: 0, overflow: 'clip' }}>
      <Box sx={{ width: sidebarWidth }}>
        <ConceptsSidebar />
      </Box>
      <ConceptsPanelDivider setSidebarWidth={setSidebarWidth} />
      <Box sx={{ flexGrow: 1, minWidth: 0, overflowY: 'clip' }}>
        <Concept />
      </Box>
    </Box>
  )
}

export default Concepts
