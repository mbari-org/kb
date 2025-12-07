import { use } from 'react'

import { Stack, Typography } from '@mui/material'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED, TOOLTIP } from '@/lib/constants.js'
import { UI_TEXT } from '@/config/text/index.js'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES
const { SWITCH } = UI_TEXT.PANELS.TEMPLATES.TOOLTIP

const SELECTED_NONE = 'With no Concept selected, all Templates are displayed.'

const selectedAvailableMessaging = (byAvailable, concept) => {
  if (!concept && !byAvailable) {
    return ['All Templates', SWITCH.EXPLICIT.CONCEPT, SELECTED_NONE]
  }

  if (!concept && byAvailable) {
    return ['All Templates', SWITCH.AVAILABLE.CONCEPT, SELECTED_NONE]
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
    fontSize: TOOLTIP.FONT.SIZE,
    fontFamily: TOOLTIP.FONT.FAMILY,
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
