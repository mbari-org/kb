import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import KBTooltip from '@/components/common/KBTooltip'
import { EXPORT_TYPE } from '@/lib/constants/exportType.js'

const ConceptExportType = ({ value = EXPORT_TYPE.JSON, onChange }) => {
  const theme = useTheme()

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  const handleChange = (_event, newValue) => {
    const selectedValue = newValue || value
    onChange?.(selectedValue)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <KBTooltip title='Export format'>
        <Typography>Type:</Typography>
      </KBTooltip>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size='small'
      >
        <ToggleButton value={EXPORT_TYPE.JSON} sx={toggleButtonSx}>
          JSON
        </ToggleButton>
        <ToggleButton value={EXPORT_TYPE.CSV} sx={toggleButtonSx}>
          CSV
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default ConceptExportType
