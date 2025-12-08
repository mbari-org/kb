import { Stack, Typography } from '@mui/material'

import { TOOLTIP } from '@/lib/constants'
import { CONFIG } from '@/config/js/index.js'

const SWITCH = CONFIG.PANELS.CONCEPTS.TEMPLATES.SWITCH

const ConceptTemplatesSwitchTooltip = ({ byAvailable }) => {
  return (
    <Stack direction='column' spacing={0} sx={{ fontSize: TOOLTIP.FONT.SIZE, fontFamily: TOOLTIP.FONT.FAMILY }}>
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
