import { useEffect, useMemo, useState, use } from 'react'
import { Stack, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import HistoryNavLinks from '@/components/common/HistoryNavLinks'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const ConceptSelect = ({
  conceptName,
  disabled = false,
  handleConceptSelect,
  handleKeyUp,
  navigation = true,
}) => {
  const theme = useTheme()

  const { concepts } = use(SelectedContext)
  const { getConceptPrimaryName, getNames } = use(TaxonomyContext)

  const [value, setValue] = useState('')

  const taxonomyNames = useMemo(() => getNames(), [getNames])

  useEffect(() => {
    const primaryName = getConceptPrimaryName(conceptName)
    setValue(primaryName || '')
  }, [conceptName, getConceptPrimaryName])

  return (
    <Stack spacing={0}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography
          sx={{
            fontSize: theme => theme.typography.fontSize * 1.2,
            fontWeight: 'bold',
            ml: 1.5,
            color: disabled ? 'text.disabled' : 'text.primary',
          }}
        >
          Concept
        </Typography>
        {navigation && (
          <Box sx={{ ml: -2 }}>
            <HistoryNavLinks history={concepts} />
          </Box>
        )}
      </Stack>
      <Autocomplete
        disabled={disabled}
        onChange={handleConceptSelect}
        options={taxonomyNames}
        renderInput={params => (
          <TextField
            {...params}
            disabled={disabled}
            sx={{
              backgroundColor: disabled ? 'action.disabledBackground' : theme.palette.primary.pale,
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: theme.palette.text.disabled,
              },
            }}
            onKeyUp={event => handleKeyUp(event, taxonomyNames)}
          />
        )}
        size='small'
        slotProps={{
          paper: {
            sx: {
              '& .MuiAutocomplete-listbox': {
                '& .MuiAutocomplete-option': {
                  backgroundColor: theme.palette.primary.light,
                },
              },
            },
          },
        }}
        value={value}
      />
      <hr />
    </Stack>
  )
}

export default ConceptSelect
