import { use, useEffect, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import ConceptContext from '@/contexts/concept/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const TaxonomySearch = ({ setAutoExpand }) => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { selectConcept } = use(SelectedContext)
  const { getConcept, getNames, getConceptPrimaryName, taxonomy } = use(TaxonomyContext)

  const taxonomyNames = getNames()

  const [value, setValue] = useState('')

  const handleConceptChange = (_event, selectedName) => {
    if (selectedName) {
      setAutoExpand({ expand: true, name: selectedName })
      selectConcept(selectedName)
    }
  }

  const handleKeyUp = event => {
    if (event.key === 'Enter') {
      const conceptName = event.target.value.trim()
      if (taxonomyNames.includes(conceptName)) {
        setAutoExpand({ expand: true, name: conceptName })
        selectConcept(conceptName)
        document.activeElement.blur()
      }
    }
  }

  useEffect(() => {
    const primaryName = getConceptPrimaryName(concept?.name)
    setValue(primaryName || '')
  }, [concept, getConcept, getConceptPrimaryName, taxonomy])

  return (
    <Autocomplete
      onChange={handleConceptChange}
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
            onKeyUp={handleKeyUp}
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

export default TaxonomySearch
