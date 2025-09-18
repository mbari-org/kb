import { use } from 'react'
import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import HistoryContext from '@/contexts/panels/history/HistoryContext'

import { CONCEPT_HISTORY } from '@/lib/constants'

const { EXTENT } = CONCEPT_HISTORY

const HistoryTableHeaderConceptRight = () => {
  const { conceptHistoryExtent, setConceptHistoryExtent } = use(HistoryContext)
  const theme = useTheme()

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  const handleChange = (_event, newValue) => setConceptHistoryExtent(newValue || EXTENT.CONCEPT)

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <Typography>Extent:</Typography>
      <ToggleButtonGroup
        value={conceptHistoryExtent}
        exclusive
        onChange={handleChange}
        size='small'
      >
        <ToggleButton value={EXTENT.CHILDREN} sx={toggleButtonSx}>
          children
        </ToggleButton>
        <ToggleButton value={EXTENT.DESCENDANTS} sx={toggleButtonSx}>
          descendants
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default HistoryTableHeaderConceptRight
