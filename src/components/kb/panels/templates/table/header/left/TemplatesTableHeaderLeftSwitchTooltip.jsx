import { use } from 'react'

import { Stack, Typography } from '@mui/material'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { FONT } from '@/lib/tooltips'

const selectedAvailableMessaging = (available, filterConcept) => {
  const noConceptSelectedDescription = 'With no Concept selected, all Templates are displayed.'
  const selectAnyConceptDescription = 'Any Concept can be selected.'
  const selectExplicitConceptsDescription = 'Only Concepts with explicit Templates can be selected.'

  if (filterConcept && available) {
    return [
      'Available Concept Templates',
      selectAnyConceptDescription,
      'All Templates available for use with the selected Concept are displayed.',
    ]
  }
  if (filterConcept && !available) {
    return [
      'Explicit Concept Templates',
      selectExplicitConceptsDescription,
      'Only Templates explicitly defined for the selected Concept are displayed.',
    ]
  }
  if (!filterConcept && available) {
    return ['All Available Templates', selectAnyConceptDescription, noConceptSelectedDescription]
  }
  return ['All Explicit Templates', selectExplicitConceptsDescription, noConceptSelectedDescription]
}

const TemplatesTableHeaderLeftSwitchTooltip = () => {
  const { available, filterConcept } = use(TemplatesContext)

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
    filterConcept
  )

  return (
    <Stack direction='column' spacing={0} sx={fontProps}>
      <Typography sx={titleProps}>{title}</Typography>
      <Stack direction='column' spacing={1}>
        <Stack direction='column' spacing={0.25}>
          <Typography>Selection</Typography>
          <Typography sx={descriptionProps}>{selectionDescription}</Typography>
        </Stack>
        <Stack direction='column' spacing={0.25}>
          <Typography>Display</Typography>
          <Typography sx={descriptionProps}>{displayDescription}</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TemplatesTableHeaderLeftSwitchTooltip
