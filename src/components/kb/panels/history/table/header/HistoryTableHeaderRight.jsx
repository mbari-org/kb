import { use } from 'react'

import { ToggleButtonGroup, ToggleButton, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryTableHeaderRight = () => {
  const { handleSortChange, sortOrder, selectedType } = use(HistoryContext)
  const theme = useTheme()

  // Don't show the Created Order controls for concept history
  if (selectedType === 'concept') {
    return null
  }

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>Created Order:</Typography>
      <ToggleButtonGroup
        value={sortOrder || 'desc'}
        exclusive
        onChange={(e, newValue) => {
          if (newValue !== null) {
            handleSortChange(newValue)
          }
        }}
        size='small'
      >
        <ToggleButton value='desc' sx={toggleButtonSx}>
          Newest
        </ToggleButton>
        <ToggleButton value='asc' sx={toggleButtonSx}>
          Oldest
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default HistoryTableHeaderRight
