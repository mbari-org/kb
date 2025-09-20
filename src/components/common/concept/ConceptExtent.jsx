import { useState } from 'react'
import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { CONCEPT_EXTENT } from '@/lib/constants'

const { CHILDREN, CONCEPT, DESCENDANTS } = CONCEPT_EXTENT

const ConceptExtent = ({ initialValue = CONCEPT, onChange  }) => {
  const [conceptExtent, setConceptExtent] = useState(initialValue)
  const theme = useTheme()

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  const handleChange = (_event, newValue) => {
    const value = newValue || CONCEPT
    setConceptExtent(value)
    onChange?.(value)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>Extent:</Typography>
      <ToggleButtonGroup
        value={conceptExtent}
        exclusive
        onChange={handleChange}
        size='small'
      >
        <ToggleButton value={CHILDREN} sx={toggleButtonSx}>
          children
        </ToggleButton>
        <ToggleButton value={DESCENDANTS} sx={toggleButtonSx}>
          descendants
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default ConceptExtent
