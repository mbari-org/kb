import { use, useMemo, useState } from 'react'

import { Box, Stack, Typography, Autocomplete, TextField, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const ChangeParentContent = () => {
  const theme = useTheme()

  const [toParent, setToParent] = useState(null)

  const { concept, modifyConcept } = use(ConceptContext)
  const { getNames } = use(TaxonomyContext)

  const optionNames = useMemo(() => {
    return getNames().filter(name => name !== concept.name && name !== concept.parent)
  }, [getNames, concept.name, concept.parent])

  const setParent = toName => {
    const parent = toName === null ? concept.parent : toName
    modifyConcept({
      type: CONCEPT_STATE.STRUCTURE.CHANGE_PARENT,
      update: { parent: parent },
    })
    toName === null ? setToParent(null) : setToParent(toName)
  }

  const handleChange = (_event, selectedName) => {
    setParent(selectedName)
  }

  const handleKeyUp = event => {
    if (event.key === 'Enter') {
      const conceptName = event.target.value.trim()
      if (optionNames.includes(conceptName)) {
        setParent(conceptName)
      }
    }
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
                value={toParent}
              />
            )}
            size='small'
            value={toParent}
            sx={{ width: '500px' }}
          />
          <Divider sx={{ marginTop: 1 }} />
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChangeParentContent
