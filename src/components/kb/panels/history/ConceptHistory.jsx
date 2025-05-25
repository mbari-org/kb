import { use, useEffect } from 'react'
import { Box, Typography } from '@mui/material'

import ConceptSearch from '@/components/common/ConceptSearch'

import SelectedContext from '@/contexts/selected/SelectedContext'

import useLoadConceptHistory from './useLoadConceptHistory'

const ConceptHistory = () => {
  const { select, selected } = use(SelectedContext)
  const { history, loadConceptHistory } = useLoadConceptHistory()

  useEffect(() => {
    if (selected.concept) {
      loadConceptHistory(selected.concept)
    }
  }, [selected.concept, loadConceptHistory])

  const handleConceptSelect = (_event, selectedName) => {
    if (selectedName) {
      select({ concept: selectedName })
    }
  }

  const handleKeyUp = (event, taxonomyNames) => {
    if (event.key === 'Enter') {
      const conceptName = event.target.value.trim()
      if (taxonomyNames.includes(conceptName)) {
        select({ concept: conceptName })
        document.activeElement.blur()
      }
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography align='center' sx={{ mt: 3, mb: 1 }} variant='h3'>
        Concept History
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -12, px: 2 }}>
        <Box sx={{ width: 400 }}>
          <ConceptSearch
            conceptName={selected.concept}
            handleConceptSelect={handleConceptSelect}
            handleKeyUp={handleKeyUp}
          />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0, px: 2 }}>
        {/* TODO: Add history listing component here */}
        {selected.concept ? (
          <div>
            History for {selected.concept}: {history.length} entries
          </div>
        ) : (
          <div>Select a concept to view its history</div>
        )}
      </Box>
    </Box>
  )
}

export default ConceptHistory
