import { Autocomplete, TextField } from '@mui/material'

const LinkNameInput = ({ disabled = false, linkNameOptions, onChange, value }) => {
  const setLinkNameValue = nextValue => {
    onChange({ target: { value: nextValue ?? '' } })
  }

  if (!linkNameOptions) {
    return (
      <TextField
        disabled={disabled}
        fullWidth
        label='Link Name'
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
      renderInput={params => <TextField {...params} disabled={disabled} label='Link Name' required size='small' />}
      size='small'
      value={value}
    />
  )
}

export default LinkNameInput
