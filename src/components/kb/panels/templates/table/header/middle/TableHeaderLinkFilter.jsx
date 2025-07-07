import { useCallback, useState, useEffect } from 'react'
import { Box, TextField, IconButton } from '@mui/material'
import { IoClose } from 'react-icons/io5'

import useDebounce from '@/hooks/useDebounce'

const TableHeaderLinkFilter = ({ name, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '')
  const debouncedOnChange = useDebounce(onChange, 300)

  // Sync local state with prop value
  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  const handleInputChange = useCallback(
    event => {
      const newValue = event.target.value
      setInputValue(newValue)
      debouncedOnChange(name, newValue)
    },
    [debouncedOnChange, name]
  )

  const handleClear = useCallback(() => {
    setInputValue('')
    debouncedOnChange(name, '')
  }, [debouncedOnChange, name])

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <TextField
        onChange={handleInputChange}
        placeholder={`Filter link ${name.replace('link', '').toLowerCase()}`}
        size='small'
        sx={{ minWidth: 100 }}
        value={inputValue}
      />
      {inputValue && (
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

export default TableHeaderLinkFilter
