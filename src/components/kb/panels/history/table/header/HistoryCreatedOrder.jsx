import { Typography, RadioGroup, FormControlLabel, Radio, Stack } from '@mui/material'

const HistoryCreatedOrder = ({ sortOrder = 'desc', handleSortChange }) => {
  return (
    <Stack direction='row' spacing={3} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>History Created Data:</Typography>
      <RadioGroup row value={sortOrder || 'desc'} onChange={e => handleSortChange(e.target.value)}>
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
      </RadioGroup>
    </Stack>
  )
}

export default HistoryCreatedOrder
