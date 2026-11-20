import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'
import { EXPORT_TYPE } from '@/lib/constants/exportType.js'
import CONFIG from '@/lib/config'

const { FORMAT, FORMAT_TOOLTIP, TYPE_LABEL } = CONFIG.PANELS.CONCEPTS.EXPORT

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
    <Stack direction='row' spacing={1} sx={{ alignItems: 'center', mr: 0.5 }}>
      <KBTooltipTarget title={FORMAT_TOOLTIP}>
        <Typography>{TYPE_LABEL}</Typography>
      </KBTooltipTarget>
      <ToggleButtonGroup value={value} exclusive onChange={handleChange} size='small'>
        <ToggleButton value={EXPORT_TYPE.JSON} sx={toggleButtonSx}>
          {FORMAT.JSON}
        </ToggleButton>
        <ToggleButton value={EXPORT_TYPE.CSV} sx={toggleButtonSx}>
          {FORMAT.CSV}
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default ConceptExportType
