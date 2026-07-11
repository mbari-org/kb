import { useState } from 'react'
import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/text'

const { CHILDREN, SOLO: CONCEPT_VALUE, DESCENDANTS } = CONCEPT.EXTENT
const {
  BUTTON: { CHILDREN: CHILDREN_TEXT, DESCENDANTS: DESCENDANTS_TEXT },
  TOOLTIP: { EXTENT: EXTENT_TOOLTIP, CHILDREN: CHILDREN_TOOLTIP, DESCENDANTS: DESCENDANTS_TOOLTIP },
} = CONFIG.CONCEPT.EXTENT

const ConceptExtent = ({
  initialValue = CONCEPT_VALUE,
  label = 'Extent:',
  onChange,
}) => {
  const [conceptExtent, setConceptExtent] = useState(initialValue)
  const theme = useTheme()

  const toggleButtonSx = {
    ...theme.toggleButton,
    fontSize: '0.75rem',
    padding: '4px 8px',
  }

  const handleChange = (_event, newValue) => {
    const value = newValue || CONCEPT_VALUE
    setConceptExtent(value)
    onChange?.(value)
  }

  const childrenButton = (
    <ToggleButton value={CHILDREN} sx={toggleButtonSx}>
      <KBTooltipTarget title={CHILDREN_TOOLTIP} wrapper='span' wrapperSx={{ display: 'inline-flex' }}>
        {CHILDREN_TEXT}
      </KBTooltipTarget>
    </ToggleButton>
  )

  const descendantsButton = (
    <ToggleButton value={DESCENDANTS} sx={toggleButtonSx}>
      <KBTooltipTarget title={DESCENDANTS_TOOLTIP} wrapper='span' wrapperSx={{ display: 'inline-flex' }}>
        {DESCENDANTS_TEXT}
      </KBTooltipTarget>
    </ToggleButton>
  )

  const labelElement = <Typography>{label}</Typography>

  return (
    <Stack direction='row' spacing={1} sx={{ alignItems: 'center', mr: 0.5 }}>
      <KBTooltipTarget title={EXTENT_TOOLTIP}>{labelElement}</KBTooltipTarget>
      <ToggleButtonGroup exclusive onChange={handleChange} size='small' value={conceptExtent}>
        {childrenButton}
        {descendantsButton}
      </ToggleButtonGroup>
    </Stack>
  )
}

export default ConceptExtent
