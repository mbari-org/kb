import { Stack, Typography } from '@mui/material'

import { FONT } from '@/lib/constants'

const onText = 'On: Show available templates that can be used with this concept'
const offText = 'Off: Show templates explicitly defined for this concept'

const ConceptTemplatesAvailableTooltip = ({ byAvailable }) => {
  return (
    <Stack direction='column' spacing={0} sx={{ fontSize: FONT.SIZE, fontFamily: FONT.FAMILY }}>
      <Typography sx={{ mb: '0.5em !important', mt: '0.25em !important', textAlign: 'center' }}>
        Available
      </Typography>
      <Stack direction='column' spacing={1}>
        <Stack direction='column' spacing={0.25}>
          <Typography color={byAvailable ? 'inherit' : 'grey.500'}>
            {onText}
          </Typography>
        </Stack>
        <Stack direction='column' spacing={0.25}>
          <Typography color={byAvailable ? 'grey.500' : 'inherit'}>
            {offText}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ConceptTemplatesAvailableTooltip
