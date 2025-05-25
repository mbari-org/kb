import { useRef, useState, use } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import ConceptSearch from '@/components/common/ConceptSearch'
import TaxonomyTree from '@/components/kb/panels/concept/tree/TaxonomyTree'

import useConceptSelect from '@/components/kb/panels/concept/useConceptSelect'

import ConceptContext from '@/contexts/concept/ConceptContext'

const TaxonomySidebar = () => {
  const sidebarRef = useRef(null)

  const [autoExpand, setAutoExpand] = useState(null)

  const { concept } = use(ConceptContext)
  const { handleConceptSelect, handleKeyUp } = useConceptSelect(setAutoExpand)

  if (!concept) return null

  return (
    <Stack sx={{ height: '100%' }}>
      <Box sx={{ ml: 1, mt: 1, mr: 1 }}>
        <ConceptSearch
          conceptName={concept.name}
          handleConceptSelect={handleConceptSelect}
          handleKeyUp={handleKeyUp}
        />
      </Box>
      <Box
        ref={sidebarRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          ml: 1,
          mr: 1,
          outline: 'none',
          overflowY: 'auto',
        }}
        tabIndex={0}
      >
        <TaxonomyTree
          autoExpand={autoExpand}
          setAutoExpand={setAutoExpand}
          sidebarRef={sidebarRef}
          style={{ flexGrow: 1, height: '100%' }}
        />
      </Box>
    </Stack>
  )
}

export default TaxonomySidebar
