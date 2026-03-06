import { use, useMemo, useRef } from 'react'
import { Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/text'

const { WIDTH } = CONCEPT.SELECT

const ConceptSelect = ({
  auxiliaryComponent,
  conceptName,
  disabled = false,
  doConceptSelected,
  ignoreClearSelection = false,
  includeSpecialOptions = false,
  inputValue,
  keepFocus = false,
  label = CONFIG.CONCEPT.SELECT.CONCEPT,
  onClear,
  onInputBlur,
  onInputChange,
  selectables,
  updateConceptSelected = true,
  width = WIDTH,
}) => {
  const theme = useTheme()
  const inputRef = useRef(null)

  const { updateSelected } = use(SelectedContext)
  const { getNames } = use(TaxonomyContext)
  const hasSpecialOptions = includeSpecialOptions

  const options = useMemo(() => {
    const baseOptions = selectables ? selectables : getNames()

    // If this is a special component (ToConcept), include special values in options
    if (hasSpecialOptions) {
      return [...baseOptions, ...CONFIG.CONCEPT.TO_SPECIAL]
    }

    return baseOptions
  }, [getNames, hasSpecialOptions, selectables])

  const handleConceptSelect = selectedName => {
    if (selectedName) {
      const isValidSelection =
        options.includes(selectedName) || (hasSpecialOptions && CONFIG.CONCEPT.TO_SPECIAL.includes(selectedName))

      if (isValidSelection) {
        const doSelection = doConceptSelected ? doConceptSelected(selectedName) : true
        if (doSelection && updateConceptSelected) {
          updateSelected({ concept: selectedName })
        }
      }
    } else {
      onClear ? onClear() : doConceptSelected?.(null)
    }
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
      {auxiliaryComponent || <ConceptSelectAuxiliary disabled={disabled} label={label} />}
      <Autocomplete
        disabled={disabled}
        onChange={(_event, selectedName, reason) => {
          if (ignoreClearSelection && reason === 'clear') {
            return
          }
          handleConceptSelect(selectedName)
        }}
        onInputChange={onInputChange}
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
            onBlur={onInputBlur}
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
        inputValue={inputValue}
        value={conceptName || ''}
      />
    </Stack>
  )
}

export default ConceptSelect
