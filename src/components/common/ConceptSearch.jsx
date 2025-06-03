import { useEffect, useMemo, useState, use } from 'react'
import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const ConceptSearch = ({ conceptName, handleConceptSelect, handleKeyUp, disabled = false }) => {
  const theme = useTheme()

  const { getConceptPrimaryName, getNames } = use(TaxonomyContext)

  const [value, setValue] = useState('')

  const taxonomyNames = useMemo(() => getNames(), [getNames])

  useEffect(() => {
    const primaryName = getConceptPrimaryName(conceptName)
    setValue(primaryName || '')
  }, [conceptName, getConceptPrimaryName])

  return (
    <Autocomplete
      disabled={disabled}
      onChange={handleConceptSelect}
      options={taxonomyNames}
      renderInput={params => (
        <Stack>
          <Typography
            sx={{
              fontSize: theme => theme.typography.fontSize * 1.2,
              fontWeight: 'bold',
              ml: 0.5,
              color: disabled ? 'text.disabled' : 'text.primary',
            }}
          >
            Search
          </Typography>
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
          <hr />
        </Stack>
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
  )
}

export default ConceptSearch
