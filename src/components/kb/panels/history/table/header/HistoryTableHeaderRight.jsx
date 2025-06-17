import { use } from 'react'

import { RadioGroup, FormControlLabel, Radio, Stack, Typography, Tooltip } from '@mui/material'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryTableHeaderRight = () => {
  const { handleSortChange, sortOrder } = use(HistoryContext)

  return (
    <Stack direction='row' spacing={3} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>Created Order:</Typography>
      <RadioGroup row value={sortOrder || 'desc'} onChange={e => handleSortChange(e.target.value)}>
        <Tooltip title='Newest First' enterDelay={50}>
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
        </Tooltip>
        <Tooltip title='Oldest First' enterDelay={50}>
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
        </Tooltip>
      </RadioGroup>
    </Stack>
  )
}

export default HistoryTableHeaderRight
