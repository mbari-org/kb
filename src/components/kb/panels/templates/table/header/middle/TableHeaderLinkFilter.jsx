import { useCallback, useState } from 'react'
import { Box, TextField, Typography, IconButton } from '@mui/material'
import { IoClose } from 'react-icons/io5'

import useDebounce from '@/hooks/useDebounce'

const TableHeaderLinkFilter = ({ name, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '')
  const debouncedOnChange = useDebounce(onChange, 300)

  const handleInputChange = useCallback(
    event => {
      const newValue = event.target.value
      setInputValue(newValue)
      debouncedOnChange(newValue)
    },
    [debouncedOnChange]
  )

  const handleClear = useCallback(() => {
    setInputValue('')
    onChange(name, '')
  }, [onChange, name])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ whiteSpace: 'nowrap' }}>Link {name}:</Typography>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <TextField
          size='small'
          placeholder={`Filter by ${name}`}
          value={inputValue}
          onChange={handleInputChange}
          sx={{ minWidth: 100 }}
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
    </Box>
  )
}

export default TableHeaderLinkFilter
