import { use } from 'react'

import { ToggleButtonGroup, ToggleButton, Stack, Typography } from '@mui/material'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryTableHeaderRight = () => {
  const { handleSortChange, sortOrder, selectedType } = use(HistoryContext)

  // Don't show the Created Order controls for concept history
  if (selectedType === 'concept') {
    return null
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>Created:</Typography>
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
        <ToggleButton value='desc'>Newest</ToggleButton>
        <ToggleButton value='asc'>Oldest</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default HistoryTableHeaderRight
