import { useRef, useState, use } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ConceptsTree from '@/components/kb/panels/concepts/tree/ConceptsTree'
import ConceptsSidebarAuxiliary from '@/components/kb/panels/concepts/ConceptsSidebarAuxiliary'

import useConceptExportModal from '@/components/kb/panels/concepts/concept/detail/export/useConceptExportModal'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ConceptsSidebar = () => {
  const sidebarRef = useRef(null)

  const { concept } = use(ConceptContext)
  const { concepts } = use(SelectedContext)
  const openExportModal = useConceptExportModal()

  const [autoExpand, setAutoExpand] = useState(null)

  if (!concept) return null

  const doConceptSelected = selectedName => {
    setAutoExpand?.({ expand: true, name: selectedName })
    return true
  }

  return (
    <Stack sx={{ height: '100%', ml: 2, mr: 1, mt: 1.75 }}>
      <ConceptSelect
        conceptName={concept.name}
        doConceptSelected={doConceptSelected}
        auxiliaryComponent={<ConceptsSidebarAuxiliary concepts={concepts} onExport={openExportModal} />}
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
