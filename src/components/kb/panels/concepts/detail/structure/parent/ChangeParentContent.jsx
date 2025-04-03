import { use, useMemo, useState } from 'react'

import { Box, Stack, Typography, Autocomplete, TextField, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const ChangeParentContent = () => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { setModalData } = use(ModalContext)
  const { getNames } = use(TaxonomyContext)

  const [parent, setParent] = useState(null)

  const optionNames = useMemo(() => {
    return getNames().filter(name => name !== concept.name && name !== concept.parent)
  }, [getNames, concept.name, concept.parent])

  const handleChange = (_event, selectedName) => {
    setParent(selectedName)
    setModalData({ parent: selectedName, modified: true })
  }

  const handleKeyUp = event => {
    const conceptName = event.target.value.trim()
    const modified = optionNames.includes(conceptName)
    setParent(conceptName)
    setModalData({ parent: conceptName, modified })
  }

  return (
    <Box>
      <Typography variant='h6'>Change Parent</Typography>
      <Stack spacing={2} sx={{ mt: 2, ml: 3, mb: 2 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography minWidth={60}>From:</Typography>
          <Typography
            color='main'
            fontFamily={theme.concept.fontFamily}
            fontSize={theme.concept.updateFontSize}
            fontWeight={theme.concept.fontWeight}
          >
            {concept.parent}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography minWidth={60}>To:</Typography>
          <Autocomplete
            onChange={handleChange}
            options={optionNames}
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                onKeyUp={handleKeyUp}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& input': {
                    color: theme.concept.color.edit,
                    fontSize: theme.concept.updateFontSize,
                    fontFamily: theme.concept.fontFamily,
                    fontWeight: theme.concept.fontWeight,
                  },
                  '&:after': {
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    content: '""',
                  },
                  '&:before': {
                    border: 'none',
                    content: '""',
                  },
                  border: 'none',
                  fontSize: theme.concept.updateFontSize,
                  fontFamily: theme.concept.fontFamily,
                  fontWeight: theme.concept.fontWeight,
                  ml: -2,
                }}
                value={parent}
              />
            )}
            size='small'
            value={parent}
            sx={{ width: '500px' }}
          />
          <Divider sx={{ marginTop: 1 }} />
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChangeParentContent
