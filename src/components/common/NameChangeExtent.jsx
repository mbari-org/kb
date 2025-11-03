import { FormControlLabel, Radio, Stack } from '@mui/material'

import { LABELS } from '@/lib/constants'

const { NAME_ONLY, REASSIGN_DATA } = LABELS.CONCEPT.CHANGE_NAME

const textSx = {
  '& .MuiFormControlLabel-label': {
    fontSize: '1rem',
  },
}

const NameChangeExtent = ({ disabled, nameChangeType, onChange }) => {
  return (
    <Stack direction='row' spacing={1}>
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
      <FormControlLabel
        control={
          <Radio
            checked={nameChangeType === REASSIGN_DATA}
            disabled={disabled}
            name='nameChangeType'
            onChange={onChange}
            size='small'
            value={REASSIGN_DATA}
          />
        }
        label={REASSIGN_DATA}
        sx={textSx}
      />
    </Stack>
  )
}

export default NameChangeExtent
