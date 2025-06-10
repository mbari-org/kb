import { useRef, useState, use } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import ConceptSelect from '@/components/common/ConceptSelect'
import TaxonomyTree from '@/components/kb/panels/concepts/tree/TaxonomyTree'

import ConceptContext from '@/contexts/concept/ConceptContext'

const TaxonomySidebar = () => {
  const sidebarRef = useRef(null)

  const { concept } = use(ConceptContext)

  const [autoExpand, setAutoExpand] = useState(null)

  const doConceptSelect = selectedName => {
    setAutoExpand?.({ expand: true, name: selectedName })
    return true
  }

  if (!concept) return null

  return (
    <Stack sx={{ height: '100%' }}>
      <ConceptSelect
        conceptName={concept.name}
        doConceptSelect={doConceptSelect}
        sx={{ ml: 1, mt: 1, mr: 1 }}
      />
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
