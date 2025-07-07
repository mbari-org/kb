import { useCallback, useState, useEffect } from 'react'
import { Box, TextField, IconButton } from '@mui/material'
import { IoClose } from 'react-icons/io5'

import useDebounce from '@/hooks/useDebounce'

const TextInput = ({
  value,
  onChange,
  placeholder,
  size = 'small',
  sx = {},
  debounceMs = 0,
  showClearButton = true,
  ...textFieldProps
}) => {
  const [inputValue, setInputValue] = useState(value || '')

  // Use debounced onChange if debounceMs is provided
  const debouncedOnChange = useDebounce(onChange, debounceMs)
  const handleChange = debounceMs > 0 ? debouncedOnChange : onChange

  // Sync local state with prop value
  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  const handleInputChange = useCallback(
    event => {
      const newValue = event.target.value
      setInputValue(newValue)
      handleChange?.(event)
    },
    [handleChange]
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
    handleChange?.(syntheticEvent)
  }, [handleChange, textFieldProps.name])

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <TextField
        {...textFieldProps}
        onChange={handleInputChange}
        placeholder={placeholder}
        size={size}
        sx={sx}
        value={inputValue}
      />
      {showClearButton && inputValue && (
        <IconButton
          size='small'
          onClick={handleClear}
          sx={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            padding: 0.5,
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
