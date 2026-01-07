import { useCallback, useState } from 'react'
import { Box, TextField, IconButton } from '@mui/material'
import { IoClose } from 'react-icons/io5'

const TextInput = ({
  value,
  onChange,
  placeholder,
  size = 'small',
  sx = {},
  showClearButton = true,
  ...textFieldProps
}) => {
  const [inputValue, setInputValue] = useState(value || '')

  if (value !== undefined && inputValue !== value) {
    setInputValue(value)
  }

  const handleInputChange = useCallback(
    event => {
      const newValue = event.target.value
      setInputValue(newValue)
      onChange?.(event)
    },
    [onChange]
  )

  const handleClear = useCallback(() => {
    setInputValue('')
    // Create a synthetic event for the clear action
    const syntheticEvent = {
      target: {
        name: textFieldProps.name,
        value: '',
      },
    }
    onChange?.(syntheticEvent)
  }, [onChange, textFieldProps.name])

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <TextField
        {...textFieldProps}
        onChange={handleInputChange}
        placeholder={placeholder}
        size={size}
        sx={sx}
        value={inputValue}
        fullWidth
      />
      {showClearButton && inputValue && (
        <IconButton
          size='small'
          onClick={handleClear}
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            paddingRight: 0.25,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <IoClose size={16} />
        </IconButton>
      )}
    </Box>
  )
}

export default TextInput
