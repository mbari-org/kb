import { use } from 'react'

import { Stack, Typography } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { FONT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const onText = 'On: Show available templates that can be used with this concept'
const offText = 'Off: Show templates explicitly defined for this concept'

const ConceptTemplatesAvailableTooltip = ({ children }) => {
  const { getSettings } = use(SelectedContext)

  const available = getSettings(TEMPLATES.KEY, TEMPLATES.AVAILABLE)

  const fontProps = {
    fontSize: FONT.SIZE,
    fontFamily: FONT.FAMILY,
  }

  const titleProps = {
    mb: '0.5em !important',
    mt: '0.25em !important',
    textAlign: 'center',
  }

  const onColor = available ? 'inherit' : 'grey.500'
  const offColor = available ? 'grey.500' : 'inherit'

  return (
    <KBTooltip
      title={
        <Stack direction='column' spacing={0} sx={fontProps}>
          <Typography sx={titleProps}>Available</Typography>
          <Stack direction='column' spacing={1}>
            <Stack direction='column' spacing={0.25}>
              <Typography color={onColor}>{onText}</Typography>
            </Stack>
            <Stack direction='column' spacing={0.25}>
              <Typography color={offColor}>{offText}</Typography>
            </Stack>
          </Stack>
        </Stack>
      }
      placement='top'
    >
      {children}
    </KBTooltip>
  )
}

export default ConceptTemplatesAvailableTooltip
