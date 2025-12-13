import { useState } from 'react'
import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/text'
import KBTooltip from '@/components/common/KBTooltip'

const { CHILDREN, SOLO: CONCEPT_VALUE, DESCENDANTS } = CONCEPT.EXTENT
const { CHILDREN: CHILDREN_TEXT, DESCENDANTS: DESCENDANTS_TEXT } = CONFIG.CONCEPT.EXTENT

const ConceptExtent = ({
  initialValue = CONCEPT_VALUE,
  label = 'Extent:',
  labelTooltip,
  childrenTooltip,
  descendantsTooltip,
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
      {CHILDREN_TEXT}
    </ToggleButton>
  )

  const descendantsButton = (
    <ToggleButton value={DESCENDANTS} sx={toggleButtonSx}>
      {DESCENDANTS_TEXT}
    </ToggleButton>
  )

  const labelElement = <Typography>{label}</Typography>

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 0.5 }}>
      {labelTooltip ? (
        <KBTooltip title={labelTooltip}>{labelElement}</KBTooltip>
      ) : (
        <KBTooltip title='Extend Concept data to either Children or Descendants'>
          {labelElement}
        </KBTooltip>
      )}
      <ToggleButtonGroup
        exclusive
        onChange={handleChange}
        size='small'
        value={conceptExtent}
      >
        {childrenTooltip ? (
          <KBTooltip title={childrenTooltip}>{childrenButton}</KBTooltip>
        ) : (
          childrenButton
        )}
        {descendantsTooltip ? (
          <KBTooltip title={descendantsTooltip}>{descendantsButton}</KBTooltip>
        ) : (
          descendantsButton
        )}
      </ToggleButtonGroup>
    </Stack>
  )
}

export default ConceptExtent
