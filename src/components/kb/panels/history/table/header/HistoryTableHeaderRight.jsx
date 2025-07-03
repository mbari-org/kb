import { use } from 'react'

import { RadioGroup, FormControlLabel, Radio, Stack, Typography } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryTableHeaderRight = () => {
  const { handleSortChange, sortOrder, selectedType } = use(HistoryContext)

  // Don't show the Created Order controls for concept history
  if (selectedType === 'concept') {
    return null
  }

  return (
    <Stack direction='row' spacing={3} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>Created Order:</Typography>
      <RadioGroup row value={sortOrder || 'desc'} onChange={e => handleSortChange(e.target.value)}>
        <KBTooltip title='Oldest First' enterDelay={50}>
          <FormControlLabel
            control={<Radio size='small' />}
            label='↓'
            sx={{
              mr: 2,
              '& .MuiFormControlLabel-label': {
                ml: 0,
                pl: 0,
              },
              '& .MuiRadio-root': {
                p: 0,
              },
            }}
            value='desc'
          />
        </KBTooltip>
        <KBTooltip title='Newest First' enterDelay={50}>
          <FormControlLabel
            control={<Radio size='small' />}
            label='↑'
            sx={{
              mr: 2,
              '& .MuiFormControlLabel-label': {
                ml: 0,
                pl: 0,
              },
              '& .MuiRadio-root': {
                p: 0,
              },
            }}
            value='asc'
          />
        </KBTooltip>
      </RadioGroup>
    </Stack>
  )
}

export default HistoryTableHeaderRight
