import { useRef, useState, use } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ConceptsTree from '@/components/kb/panels/concepts/tree/ConceptsTree'
import KBTooltip from '@/components/common/KBTooltip'

import useConceptExportModal from '@/components/kb/panels/concepts/concept/export/useConceptExportModal'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_SELECT } from '@/lib/constants'

const NAV_HISTORY = CONCEPT_SELECT.RIGHT_COMPONENT.NAV_HISTORY

const ConceptsSidebar = () => {
  const sidebarRef = useRef(null)

  const { concept } = use(ConceptContext)
  const openExportModal = useConceptExportModal()

  const [autoExpand, setAutoExpand] = useState(null)

  if (!concept) return null

  const doConceptSelected = selectedName => {
    setAutoExpand?.({ expand: true, name: selectedName })
    return true
  }

  const exportConcept = () => {
    openExportModal()
  }

  const leftComponent = (
    <KBTooltip title='Export concept data'>
      <Button
        onClick={exportConcept}
        size='small'
        sx={{ ml: 1, mt: 0.25, minWidth: 'auto', px: 1 }}
      >
        Export
      </Button>
    </KBTooltip>
  )

  return (
    <Stack sx={{ height: '100%', ml: 2, mr: 1, mt: 1.75 }}>
      <ConceptSelect
        conceptName={concept.name}
        doConceptSelected={doConceptSelected}
        leftComponent={leftComponent}
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
        <ConceptsTree
          autoExpand={autoExpand}
          setAutoExpand={setAutoExpand}
          sidebarRef={sidebarRef}
          style={{ flexGrow: 1, height: '100%' }}
        />
      </Box>
    </Stack>
  )
}

export default ConceptsSidebar
