import { use } from 'react'

import { ToggleButtonGroup, ToggleButton, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryTableHeaderTypeRight = () => {
  const { handleSortChange, pageState } = use(HistoryContext)
  const theme = useTheme()

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>Created Order:</Typography>
      <ToggleButtonGroup
        value={pageState.sortOrder || 'desc'}
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

export default HistoryTableHeaderTypeRight
