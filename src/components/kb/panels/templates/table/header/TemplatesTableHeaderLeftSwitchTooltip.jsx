import { Stack, Typography } from '@mui/material'

import { FONT } from '@/lib/tooltips'

const TemplatesTableHeaderLeftSwitchTooltip = () => {
  const fontProps = {
    fontSize: FONT.SIZE,
    fontFamily: FONT.FAMILY,
  }

  return (
    <Stack direction='column' spacing={0.5} sx={fontProps}>
      <Typography>Available</Typography>
      <Stack direction='column' spacing={0.5} sx={{ ml: '0.5em !important' }}>
        <Stack direction='column' spacing={0.5} sx={{ ml: '0.5em !important' }}>
          <Typography>Off</Typography>
          <Typography sx={{ ml: '1em !important' }}>
            The Concept options are limited to Concepts on which a Template is explicitly defined.
          </Typography>
        </Stack>
        <Stack direction='column' spacing={0.5} sx={{ ml: '0.5em !important' }}>
          <Typography>On</Typography>
          <Typography sx={{ ml: '1em !important' }}>
            Any Concept may be selected, and the displayed Templates are those available for use
            with that selected Concept.
          </Typography>
        </Stack>
        <Stack direction='column' spacing={0.5} sx={{ ml: '0.5em !important' }}>
          <Typography>No Concept</Typography>
          <Typography sx={{ ml: '1em !important' }}>
            In either case, if no Concept is selected, all Templates are displayed.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TemplatesTableHeaderLeftSwitchTooltip
