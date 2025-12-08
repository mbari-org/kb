import { useState } from 'react'
import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { CONCEPT } from '@/lib/constants'
import KBTooltip from '@/components/common/KBTooltip'

const { CHILDREN, SOLO: CONCEPT_VALUE, DESCENDANTS } = CONCEPT.EXTENT

const ConceptExtent = ({ initialValue = CONCEPT_VALUE, onChange }) => {
  const [conceptExtent, setConceptExtent] = useState(initialValue)
  const theme = useTheme()

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  const handleChange = (_event, newValue) => {
    const value = newValue || CONCEPT_VALUE
    setConceptExtent(value)
    onChange?.(value)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <KBTooltip title='Extend Concept data to either Children or Descendants'>
        <Typography>Extent:</Typography>
      </KBTooltip>
      <ToggleButtonGroup
        exclusive
        onChange={handleChange}
        size='small'
        value={conceptExtent}
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
