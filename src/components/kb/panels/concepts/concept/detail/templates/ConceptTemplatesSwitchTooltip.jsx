import { Stack, Typography } from '@mui/material'

import CONFIG from '@/config'

const TOOLTIP_FONT = {
  SIZE: '1em',
  FAMILY: 'Arial, sans-serif',
}

const SWITCH = CONFIG.PANELS.CONCEPTS.TEMPLATES.SWITCH

const ConceptTemplatesSwitchTooltip = ({ byAvailable }) => {
  return (
    <Stack direction='column' spacing={0} sx={{ fontSize: TOOLTIP_FONT.SIZE, fontFamily: TOOLTIP_FONT.FAMILY }}>
      <Typography sx={{ mb: '0.5em !important', mt: '0.25em !important', textAlign: 'center' }}>
        {SWITCH.LABEL}
      </Typography>
      <Stack direction='column' spacing={1}>
        <Stack direction='column' spacing={0.25}>
          <Typography color={byAvailable ? 'inherit' : 'grey.500'}>
            {SWITCH.TOOLTIP.AVAILABLE}
          </Typography>
        </Stack>
        <Stack direction='column' spacing={0.25}>
          <Typography color={byAvailable ? 'grey.500' : 'inherit'}>
            {SWITCH.TOOLTIP.EXPLICIT}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ConceptTemplatesSwitchTooltip
