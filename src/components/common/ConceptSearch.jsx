import { useEffect, useMemo, useState, use } from 'react'
import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const ConceptSearch = ({ conceptName, handleConceptSelect, handleKeyUp }) => {
  const theme = useTheme()
  const [value, setValue] = useState('')
  const { getConceptPrimaryName, getNames } = use(TaxonomyContext)

  const taxonomyNames = useMemo(() => getNames(), [getNames])

  useEffect(() => {
    const primaryName = getConceptPrimaryName(conceptName)
    setValue(primaryName || '')
  }, [conceptName, getConceptPrimaryName])

  return (
    <Autocomplete
      onChange={handleConceptSelect}
      options={taxonomyNames}
      renderInput={params => (
        <Stack>
          <Typography
            sx={{
              fontSize: theme => theme.typography.fontSize * 1.4,
              fontWeight: 'bold',
            }}
          >
            Search
          </Typography>
          <TextField
            {...params}
            sx={{
              backgroundColor: theme.palette.primary.pale,
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
