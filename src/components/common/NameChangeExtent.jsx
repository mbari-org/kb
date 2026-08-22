import { FormControlLabel, Radio, Stack, Typography } from '@mui/material'

import CONFIG from '@/lib/config'

const { NAME_ONLY, REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME
const { NAME_ONLY_WARN } = CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME

const textSx = {
  '& .MuiFormControlLabel-label': {
    fontSize: '1rem',
  },
}

const NameChangeExtent = ({ disabled, nameChangeType, onChange }) => {
  return (
    <Stack direction='column' spacing={1} sx={{ mb: 2 }}>
      <Stack direction='row' spacing={3}>
        <FormControlLabel
          control={
            <Radio
              checked={nameChangeType === REASSIGN}
              disabled={disabled}
              name='nameChangeType'
              onChange={onChange}
              size='small'
              value={REASSIGN}
            />
          }
          label={REASSIGN}
          sx={textSx}
        />
        <FormControlLabel
          control={
            <Radio
              checked={nameChangeType === NAME_ONLY}
              disabled={disabled}
              name='nameChangeType'
              onChange={onChange}
              size='small'
              value={NAME_ONLY}
            />
          }
          label={NAME_ONLY}
          sx={textSx}
        />
      </Stack>
      <Typography
        sx={{
          color: theme => theme.palette.cancel.main,
          fontSize: '0.875rem',
          visibility: nameChangeType === NAME_ONLY ? 'visible' : 'hidden',
        }}
      >
        {NAME_ONLY_WARN}
      </Typography>
    </Stack>
  )
}

export default NameChangeExtent
