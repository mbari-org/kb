import { use } from 'react'

import { ToggleButtonGroup, ToggleButton, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import CONFIG from '@/text'
import KBTooltip from '@/components/common/KBTooltip'

const HistoryTableHeaderTypeRight = () => {
  const { handleSortChange, pageState } = use(HistoryContext)
  const theme = useTheme()

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  const labelElement = <Typography>{CONFIG.PANELS.HISTORY.ORDER.LABEL}:</Typography>

  const newestButton = (
    <ToggleButton value='desc' sx={toggleButtonSx}>
      {CONFIG.PANELS.HISTORY.ORDER.BUTTON.NEWEST}
    </ToggleButton>
  )

  const oldestButton = (
    <ToggleButton value='asc' sx={toggleButtonSx}>
      {CONFIG.PANELS.HISTORY.ORDER.BUTTON.OLDEST}
    </ToggleButton>
  )

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      <KBTooltip title={CONFIG.PANELS.HISTORY.TOOLTIP.ORDER.LABEL}>
        {labelElement}
      </KBTooltip>
      <ToggleButtonGroup
        value={pageState.sortOrder || 'desc'}
        exclusive
        onChange={(e, newValue) => {
          if (newValue !== null) {
            handleSortChange(newValue)
          }
        }}
        size='small'
      >
        <KBTooltip title={CONFIG.PANELS.HISTORY.TOOLTIP.ORDER.NEWEST}>
          {newestButton}
        </KBTooltip>
        <KBTooltip title={CONFIG.PANELS.HISTORY.TOOLTIP.ORDER.OLDEST}>
          {oldestButton}
        </KBTooltip>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default HistoryTableHeaderTypeRight
