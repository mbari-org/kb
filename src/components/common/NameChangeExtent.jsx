import { FormControlLabel, Radio, Stack } from '@mui/material'

import CONFIG from '@/config'

const { NAME_ONLY, REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME

const textSx = {
  '& .MuiFormControlLabel-label': {
    fontSize: '1rem',
  },
}

const NameChangeExtent = ({ disabled, nameChangeType, onChange }) => {
  return (
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
  )
}

export default NameChangeExtent
