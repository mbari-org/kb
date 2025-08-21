import { useState } from 'react'
import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const HistoryTableHeaderConceptRight = () => {
  const [extent, setExtent] = useState(null) // null | 'children' | 'descendants'
  const theme = useTheme()

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  const handleChange = (_event, newValue) => {
    // Allow deselect (newValue can be null). Do not coerce to a default.
    setExtent(newValue)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>Extent:</Typography>
      <ToggleButtonGroup value={extent} exclusive onChange={handleChange} size='small'>
        <ToggleButton value='children' sx={toggleButtonSx}>
          children
        </ToggleButton>
        <ToggleButton value='descendants' sx={toggleButtonSx}>
          descendants
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default HistoryTableHeaderConceptRight
