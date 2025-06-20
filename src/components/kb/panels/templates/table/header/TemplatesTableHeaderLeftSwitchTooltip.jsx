import { use } from 'react'

import { Stack, Typography } from '@mui/material'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/constants'
import { FONT } from '@/lib/tooltips'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesTableHeaderLeftSwitchTooltip = () => {
  const { getSelected } = use(SelectedContext)
  const { filterConcept } = use(TemplatesContext)

  const available = getSelected(TEMPLATES.KEY)[TEMPLATES.AVAILABLE]

  const colorOn = 'common.white'
  const colorOff = 'grey.400'

  const conceptColor = filterConcept ? colorOn : colorOff
  const noConceptColor = !filterConcept ? colorOn : colorOff
  const offColor = !available ? colorOn : colorOff
  const onColor = available ? colorOn : colorOff

  const fontProps = {
    fontSize: FONT.SIZE,
    fontFamily: FONT.FAMILY,
  }

  return (
    <Stack direction='column' spacing={1} sx={fontProps}>
      <Stack direction='column' spacing={0.5} sx={{ ml: '0.5em !important', mt: '1em !important' }}>
        <Typography sx={{ textAlign: 'center' }}>Concept</Typography>
        <Stack
          direction='column'
          spacing={0.5}
          sx={{ ml: '0.5em !important', color: conceptColor }}
        >
          <Typography>Selected</Typography>
          <Typography sx={{ ml: '1em !important' }}>
            With a Concept selected, Templates available for that Concept are displayed.
          </Typography>
        </Stack>
        <Stack
          direction='column'
          spacing={0.5}
          sx={{ ml: '0.5em !important', color: noConceptColor }}
        >
          <Typography>No Selection</Typography>
          <Typography sx={{ ml: '1em !important' }}>
            With no Concept selected, all Templates are displayed.
          </Typography>
        </Stack>
      </Stack>
      <Stack direction='column' spacing={0.5} sx={{ ml: '0.5em !important', mt: '1em !important' }}>
        <Typography sx={{ textAlign: 'center' }}>Available</Typography>
        <Stack direction='column' spacing={0.5} sx={{ ml: '0.5em !important', color: offColor }}>
          <Typography>Off</Typography>
          <Typography sx={{ ml: '1em !important' }}>
            Concept selection is limited to Concepts on which a Template is explicitly defined.
          </Typography>
        </Stack>
        <Stack direction='column' spacing={0.5} sx={{ ml: '0.5em !important', color: onColor }}>
          <Typography>On</Typography>
          <Typography sx={{ ml: '1em !important' }}>
            Any Concept may be selected, and the displayed Templates are those available for use
            with that selected Concept.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TemplatesTableHeaderLeftSwitchTooltip
