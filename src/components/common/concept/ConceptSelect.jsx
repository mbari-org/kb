import { use, useMemo, useRef } from 'react'
import { Stack, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import NavHistoryLinks from '@/components/common/NavHistoryLinks'
import ToConceptSpecial from '@/components/common/concept/ToConceptSpecial'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_SELECT } from '@/lib/constants'

const { CONCEPT_LABEL, RIGHT_COMPONENT, WIDTH } = CONCEPT_SELECT
const { NAV_HISTORY, NONE, SPECIAL } = RIGHT_COMPONENT

const ConceptSelect = ({
  conceptName,
  disabled = false,
  doConceptSelect,
  keepFocus = false,
  label = CONCEPT_LABEL,
  rightComponent = NONE,
  selectables,
  width = WIDTH,
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
    <Stack spacing={0} sx={{ width }}>
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
        {rightComponent !== NONE && !disabled && (
          <Box sx={{ ml: -2, display: 'flex', alignItems: 'center' }}>
            {rightComponent === NAV_HISTORY && <NavHistoryLinks history={concepts} />}
            {rightComponent === SPECIAL && (
              <ToConceptSpecial onChange={specialName => doConceptSelect(specialName)} />
            )}
          </Box>
        )}
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
