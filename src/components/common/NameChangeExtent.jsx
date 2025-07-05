import { FormControlLabel, Radio, Stack } from '@mui/material'
import { LABELS } from '@/lib/constants'

const { NAME_ONLY, ASSOCIATED_DATA } = LABELS.CONCEPT.CHANGE_NAME

const NameChangeExtent = ({ disabled, nameChangeType, onChange }) => {
  return (
    <Stack direction='row'>
      <FormControlLabel
        control={
          <Radio
            checked={nameChangeType === NAME_ONLY}
            disabled={disabled}
            name='nameChangeType'
            onChange={onChange}
            value={NAME_ONLY}
          />
        }
        label={NAME_ONLY}
      />
      <FormControlLabel
        control={
          <Radio
            checked={nameChangeType === ASSOCIATED_DATA}
            disabled={disabled}
            name='nameChangeType'
            onChange={onChange}
            value={ASSOCIATED_DATA}
          />
        }
        label={ASSOCIATED_DATA}
      />
    </Stack>
  )
}

NameChangeExtent.defaultProps = {
  nameChangeType: null,
}

export default NameChangeExtent
