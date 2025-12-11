import { use } from 'react'

import { Stack, Typography } from '@mui/material'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/constants'
import CONFIG from '@/text'

const TOOLTIP_FONT = {
  SIZE: '1em',
  FAMILY: 'Arial, sans-serif',
}

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES
const { SWITCH } = CONFIG.PANELS.TEMPLATES.TOOLTIP

const selectedAvailableMessaging = (byAvailable, concept) => {
  if (!concept && !byAvailable) {
    return [SWITCH.NO_CONCEPT.TITLE, SWITCH.EXPLICIT.CONCEPT, SWITCH.NO_CONCEPT.TEMPLATES]
  }

  if (!concept && byAvailable) {
    return [SWITCH.NO_CONCEPT.TITLE, SWITCH.AVAILABLE.CONCEPT, SWITCH.NO_CONCEPT.TEMPLATES]
  }

  if (concept && !byAvailable) {
    return [
      SWITCH.EXPLICIT.TITLE,
      SWITCH.EXPLICIT.CONCEPT,
      SWITCH.EXPLICIT.TEMPLATES,
    ]
  }

  return [
    SWITCH.AVAILABLE.TITLE,
    SWITCH.AVAILABLE.CONCEPT,
    SWITCH.AVAILABLE.TEMPLATES,
  ]
}

const TemplatesConceptAvailableTooltip = () => {
  const { byAvailable, filters } = use(TemplatesContext)

  const descriptionProps = {
    ml: '0.75em !important',
  }

  const fontProps = {
    fontSize: TOOLTIP_FONT.SIZE,
    fontFamily: TOOLTIP_FONT.FAMILY,
  }

  const titleProps = {
    mb: '0.5em !important',
    mt: '0.25em !important',
    textAlign: 'center',
  }

  const [title, selectionDescription, displayDescription] = selectedAvailableMessaging(
    byAvailable,
    filters[FILTERS.CONCEPT]
  )

  return (
    <Stack direction='column' spacing={0} sx={fontProps}>
      <Typography sx={titleProps}>{title}</Typography>
      <Stack direction='column' spacing={1}>
        <Stack direction='column' spacing={0.25}>
          <Typography>{SWITCH.CONCEPT}</Typography>
          <Typography sx={descriptionProps}>{selectionDescription}</Typography>
        </Stack>
        <Stack direction='column' spacing={0.25}>
          <Typography>{SWITCH.TEMPLATES}</Typography>
          <Typography sx={descriptionProps}>{displayDescription}</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TemplatesConceptAvailableTooltip
