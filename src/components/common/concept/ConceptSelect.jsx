import { use, useMemo, useRef } from 'react'
import { Stack, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import HistoryNavLinks from '@/components/common/HistoryNavLinks'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_SELECT } from '@/lib/constants'

const ConceptSelect = ({
  conceptName,
  disabled = false,
  doConceptSelect,
  keepFocus = false,
  label = 'Concept',
  navigation = true,
  selectables,
  sx = { width: CONCEPT_SELECT.WIDTH },
}) => {
  const theme = useTheme()
  const inputRef = useRef(null)

  const { concepts, select } = use(SelectedContext)
  const { getNames } = use(TaxonomyContext)

  const options = useMemo(() => (selectables ? selectables : getNames()), [getNames, selectables])

  const handleConceptSelect = selectedName => {
    if (selectedName) {
      if (options.includes(selectedName)) {
        const doSelection = doConceptSelect ? doConceptSelect(selectedName) : true
        if (doSelection) {
          select({ concept: selectedName })
        }
        return true
      }
      return false
    }

    doConceptSelect?.(null)
    return false
  }

  const handleKeyUp = event => {
    if (event.key === 'Enter') {
      const selectedName = event.target.value.trim()
      handleConceptSelect(selectedName)
      const inputField = inputRef.current?.querySelector('input')
      keepFocus ? inputField?.focus() : inputField?.blur()
    }
  }

  return (
    <Stack spacing={0} sx={sx}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ minHeight: '40px' }}
      >
        <Typography
          sx={{
            color: disabled ? 'text.disabled' : 'text.primary',
            fontSize: theme => theme.typography.fontSize * 1.2,
            fontWeight: 'bold',
            ml: 1.5,
          }}
        >
          {label}
        </Typography>
        <Box sx={{ ml: -2, display: 'flex', alignItems: 'center' }}>
          {navigation && !disabled && <HistoryNavLinks history={concepts} />}
        </Box>
      </Stack>
      <Autocomplete
        disabled={disabled}
        onChange={(_event, selectedName) => handleConceptSelect(selectedName)}
        options={options}
        ref={inputRef}
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
            onKeyUp={handleKeyUp}
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
        value={conceptName}
      />
      <hr />
    </Stack>
  )
}

export default ConceptSelect
