import { Autocomplete, TextField } from '@mui/material'

import CONFIG from '@/lib/config'

const LinkNameInput = ({ disabled = false, linkNameOptions, onChange, value }) => {
  const setLinkNameValue = nextValue => {
    onChange({ target: { value: nextValue ?? '' } })
  }

  if (!linkNameOptions) {
    return (
      <TextField
        disabled={disabled}
        fullWidth
        label={CONFIG.LINK.FIELDS.LINK_NAME}
        onChange={onChange}
        required
        size='small'
        value={value}
      />
    )
  }

  return (
    <Autocomplete
      disabled={disabled}
      freeSolo
      fullWidth
      onChange={(_, newValue) => setLinkNameValue(newValue)}
      onInputChange={(_, newInputValue) => setLinkNameValue(newInputValue)}
      options={linkNameOptions}
      renderInput={params => <TextField {...params} disabled={disabled} label={CONFIG.LINK.FIELDS.LINK_NAME} required size='small' />}
      size='small'
      value={value}
    />
  )
}

export default LinkNameInput
