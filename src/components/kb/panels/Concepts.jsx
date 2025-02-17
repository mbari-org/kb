import { useState } from 'react'

import Box from '@mui/material/Box'

import Concept from '@/components/kb/panels/concepts/Concept'
import ConceptDivider from './concepts/ConceptDivider'
import TaxonomySidebar from '@/components/kb/panels/concepts/TaxonomySidebar'

const Concepts = () => {
  const [sidebarWidth, setSidebarWidth] = useState(0)

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ width: sidebarWidth }}>
        <TaxonomySidebar />
      </Box>
      <ConceptDivider setSidebarWidth={setSidebarWidth} />
      <Box sx={{ flexGrow: 1, overflowY: 'hidden' }}>
        <Concept />
      </Box>
    </Box>
  )
}

export default Concepts
