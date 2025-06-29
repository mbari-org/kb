import { use } from 'react'

import { Stack, Typography } from '@mui/material'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { FONT } from '@/lib/tooltips'
import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const noConceptSelectedDescription = 'With no Concept selected, all Templates are displayed.'
const selectAnyConceptDescription = 'Any Concept can be selected.'
const selectExplicitConceptsDescription =
  'With Available off, only explicit Concept Templates are displayed.'
const availableTemplatesDescription =
  'All Templates available for use with the selected Concept are displayed.'
const explicitTemplatesDescription =
  'Only Templates explicitly defined for the selected Concept are displayed.'

const selectedAvailableMessaging = (available, concept) => {
  if (!concept) {
    return ['All Templates', selectAnyConceptDescription, noConceptSelectedDescription]
  }

  if (available) {
    return [
      'Available Concept Templates',
      selectAnyConceptDescription,
      availableTemplatesDescription,
    ]
  } else {
    return [
      'Explicit Concept Templates',
      selectExplicitConceptsDescription,
      explicitTemplatesDescription,
    ]
  }
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
