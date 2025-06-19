import { useRef, useState, use } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import TaxonomyTree from '@/components/kb/panels/concepts/tree/TaxonomyTree'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_SELECT } from '@/lib/constants'

const NAV_HISTORY = CONCEPT_SELECT.RIGHT_COMPONENT.NAV_HISTORY

const TaxonomySidebar = () => {
  const sidebarRef = useRef(null)

  const { concept } = use(ConceptContext)

  const [autoExpand, setAutoExpand] = useState(null)

  const doConceptSelected = selectedName => {
    setAutoExpand?.({ expand: true, name: selectedName })
    return true
  }

  if (!concept) return null

  return (
    <Stack sx={{ height: '100%', ml: 2, mr: 1 }}>
      <ConceptSelect
        conceptName={concept.name}
        doConceptSelected={doConceptSelected}
        rightComponent={NAV_HISTORY}
        width='auto'
      />
      <Box
        ref={sidebarRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
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
