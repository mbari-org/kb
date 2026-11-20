import { TextField } from '@mui/material'

import CONFIG from '@/lib/config'

const LinkValueInput = ({ disabled = false, onChange, value }) => (
  <TextField
    disabled={disabled}
    fullWidth
    label={CONFIG.LINK.FIELDS.LINK_VALUE}
    onChange={onChange}
    required
    size='small'
    value={value}
  />
)

export default LinkValueInput
