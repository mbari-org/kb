import { use } from 'react'

import { Stack, Typography } from '@mui/material'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { FONT } from '@/lib/tooltips'
import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const SELECTED_NONE = 'With no Concept selected, all Templates are displayed.'
const SELECT_ANY = 'For Available Templates, any Concept can be selected.'
const SELECT_RESTRICTED =
  'With Available off, only Concept with explicit Templates can be selected.'
const SELECTED_AVAILABLE =
  'All Templates available for use with the selected Concept are displayed.'
const SELECTED_EXPLICIT =
  'Only Templates explicitly defined for the selected Concept are displayed.'

const TEMPLATES_ALL = 'All Templates'
const TEMPLATES_AVAILABLE = 'Available Concept Templates'
const TEMPLATES_EXPLICIT = 'Explicit Concept Templates'

const selectedAvailableMessaging = (available, concept) => {
  if (!concept) {
    return [TEMPLATES_ALL, SELECT_RESTRICTED, SELECTED_NONE]
  }

  return available
    ? [TEMPLATES_AVAILABLE, SELECT_ANY, SELECTED_AVAILABLE]
    : [TEMPLATES_EXPLICIT, SELECT_RESTRICTED, SELECTED_EXPLICIT]
}

const TemplatesConceptAvailableTooltip = () => {
  const { available, filters } = use(TemplatesContext)

  const descriptionProps = {
    ml: '0.75em !important',
  }

  const fontProps = {
    fontSize: FONT.SIZE,
    fontFamily: FONT.FAMILY,
  }

  const titleProps = {
    mb: '0.5em !important',
    mt: '0.25em !important',
    textAlign: 'center',
  }

  const [title, selectionDescription, displayDescription] = selectedAvailableMessaging(
    available,
    filters[FILTERS.CONCEPT]
  )

  return (
    <Stack direction='column' spacing={0} sx={fontProps}>
      <Typography sx={titleProps}>{title}</Typography>
      <Stack direction='column' spacing={1}>
        <Stack direction='column' spacing={0.25}>
          <Typography>Concept Selection</Typography>
          <Typography sx={descriptionProps}>{selectionDescription}</Typography>
        </Stack>
        <Stack direction='column' spacing={0.25}>
          <Typography>Templates Display</Typography>
          <Typography sx={descriptionProps}>{displayDescription}</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TemplatesConceptAvailableTooltip
