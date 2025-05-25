import { useState } from 'react'
import { ToggleButtonGroup, Box } from '@mui/material'

import HistoryToggleButton from '@/components/kb/panels/history/HistoryToggleButton'
import TypeHistory from '@/components/kb/panels/history/TypeHistory'

const History = () => {
  const [type, setType] = useState('pending')

  const handleTypeChange = (_, newType) => !!newType && setType(newType)

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mt: 2 }}>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleTypeChange}
          aria-label='history type'
          size='small'
          sx={{ mr: 2 }}
        >
          <HistoryToggleButton value='pending' />
          <HistoryToggleButton value='approved' />
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0, mt: -8 }}>
        <TypeHistory type={type} />
      </Box>
    </Box>
  )
}

export default History
