import { use } from 'react'

import { Box, TextField, Typography, Stack } from '@mui/material' // Added Stack
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

const NameContent = () => {
  const { concept: conceptTheme, palette } = useTheme()

  const { concept, editingState, modifyConcept } = use(ConceptContext)
  const { getNames } = use(TaxonomyContext)

  const taxonomyNames = getNames()

  const fromColor = conceptTheme.color.clean

  const toColor =
    editingState.name === concept.name || taxonomyNames.includes(editingState.name)
      ? palette.grey[500]
      : conceptTheme.color.pending

  const handleChange = event => {
    modifyConcept({
      type: CONCEPT_STATE.STRUCTURE.NAME_CHANGE,
      update: { field: 'name', value: event.target.value },
    })
  }

  return (
    <Box>
      <Stack spacing={2} sx={{ mt: 2, ml: 3, mb: 2 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography minWidth={60}>From:</Typography>
          <Typography
            color={fromColor}
            fontFamily={conceptTheme.fontFamily}
            fontSize={conceptTheme.updateFontSize}
            fontWeight={conceptTheme.fontWeight}
            variant='h6'
          >
            {concept.name}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography minWidth={60}>To:</Typography>
          <TextField
            fullWidth
            onChange={handleChange}
            slotProps={{
              input: {
                sx: {
                  color: toColor,
                  cursor: 'text',
                  fontFamily: conceptTheme.fontFamily,
                  fontSize: conceptTheme.updateFontSize,
                  fontWeight: conceptTheme.fontWeight,
                  height: 'auto',
                  borderBottom: 'none',
                  '&::before': { borderBottom: 'none' },
                  '&::after': { borderBottom: 'none' },
                },
              },
            }}
            value={editingState.name}
            variant='standard'
          />
        </Stack>
      </Stack>
      <Box sx={{ borderTop: '1px solid #000000' }}>
        <Box sx={{ mt: 2 }}>
          <div>{`Updating the name of concept will affect CxTBD link realizations.`}</div>
          <div>{`Proceed with caution.`}</div>
        </Box>
      </Box>
    </Box>
  )
}

export default NameContent
