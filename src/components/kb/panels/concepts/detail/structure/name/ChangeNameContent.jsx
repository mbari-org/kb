import { use, useState } from 'react'

import { Box, TextField, Typography, Stack } from '@mui/material' // Added Stack
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const ChangeNameContent = () => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ModalContext)
  const { getNames } = use(TaxonomyContext)

  const [primaryName, setPrimaryName] = useState(concept.name)

  const fromColor = 'main'
  const toColor = modalData.modified ? theme.palette.primary.edit : theme.palette.grey[500]

  const handleChange = event => {
    const { value } = event.target
    setPrimaryName(value)
    const modified = value !== concept.name && !getNames().includes(value)
    setModalData({ name: value, modified })
  }

  return (
    <Box>
      <Stack spacing={2} sx={{ mt: 2, ml: 3, mb: 2 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography minWidth={60}>From:</Typography>
          <Typography
            color={fromColor}
            fontFamily={theme.concept.fontFamily}
            fontSize={theme.concept.updateFontSize}
            fontWeight={theme.concept.fontWeight}
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
                  fontFamily: theme.concept.fontFamily,
                  fontSize: theme.concept.updateFontSize,
                  fontWeight: theme.concept.fontWeight,
                  height: 'auto',
                  borderBottom: 'none',
                  '&::before': { borderBottom: 'none' },
                  '&::after': { borderBottom: 'none' },
                },
              },
            }}
            value={primaryName}
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

export default ChangeNameContent
