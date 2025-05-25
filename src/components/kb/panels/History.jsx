import { use } from 'react'
import { ToggleButtonGroup, Box } from '@mui/material'

import HistoryToggleButton from '@/components/kb/panels/history/HistoryToggleButton'
import TypeHistory from '@/components/kb/panels/history/TypeHistory'
import ConceptHistory from '@/components/kb/panels/history/ConceptHistory'
import SelectedContext from '@/contexts/selected/SelectedContext'

const History = () => {
  const { selected, select } = use(SelectedContext)
  const isTypeHistory = selected.history === 'pending' || selected.history === 'approved'

  const handleHistorySelection = (_, newSelection) =>
    !!newSelection && select({ history: newSelection })

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mt: 2 }}>
        <ToggleButtonGroup
          value={selected.history}
          exclusive
          onChange={handleHistorySelection}
          aria-label='history type'
          size='small'
          sx={{ mr: 2 }}
        >
          <HistoryToggleButton value='pending' />
          <HistoryToggleButton value='approved' />
          <HistoryToggleButton value='concept' />
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0, mt: -8 }}>
        {isTypeHistory ? <TypeHistory type={selected.history} /> : <ConceptHistory />}
      </Box>
    </Box>
  )
}

export default History
