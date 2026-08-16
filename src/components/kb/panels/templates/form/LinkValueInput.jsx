import { TextField } from '@mui/material'

const LinkValueInput = ({ disabled = false, onChange, value }) => (
  <TextField
    disabled={disabled}
    fullWidth
    label='Link Value'
    onChange={onChange}
    required
    size='small'
    value={value}
  />
)

export default LinkValueInput
