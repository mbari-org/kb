import { use, useCallback, useMemo, useRef } from 'react'
import { Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import filterConceptOptions from '@/lib/concept/filterConceptOptions'
import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/lib/config'

const { WIDTH } = CONCEPT.SELECT

const ConceptSelect = ({
  auxiliaryComponent,
  conceptName,
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
  selectorTooltip,
  updateConceptSelected = true,
  width = WIDTH,
}) => {
  const theme = useTheme()
  const inputRef = useRef(null)

  const { updateSelected } = use(SelectedContext)
  const { getConceptPrimaryName, getNames } = use(TaxonomyContext)

  const options = useMemo(() => {
    const baseOptions = selectables ? selectables : getNames()

    // If this is a special component (ToConcept), include special values in options
    if (includeSpecialOptions) {
      const specialOptions = CONFIG.CONCEPT.TO_SPECIAL.filter(option => !baseOptions.includes(option))
      return [...baseOptions, ...specialOptions]
    }

    return baseOptions
  }, [getNames, includeSpecialOptions, selectables])

  const handleConceptSelect = useCallback(
    selectedName => {
      if (selectedName) {
        const isSpecialSelection = includeSpecialOptions && CONFIG.CONCEPT.TO_SPECIAL.includes(selectedName)
        const isValidSelection = options.includes(selectedName) || isSpecialSelection

        if (isValidSelection) {
          const conceptName = isSpecialSelection ? selectedName : getConceptPrimaryName(selectedName) || selectedName
          const doSelection = doConceptSelected ? doConceptSelected(conceptName) : true
          if (doSelection && updateConceptSelected) {
            updateSelected({ concept: conceptName })
          }
        }
      } else {
        onClear ? onClear() : doConceptSelected?.(null)
      }
    },
    [
      doConceptSelected,
      getConceptPrimaryName,
      includeSpecialOptions,
      onClear,
      options,
      updateConceptSelected,
      updateSelected,
    ]
  )

  const handleKeyUp = useCallback(
    event => {
      if (event.key === 'Enter') {
        const selectedName = event.target.value.trim()
        handleConceptSelect(selectedName)
        const inputField = inputRef.current?.querySelector('input')
        keepFocus ? inputField?.focus() : inputField?.blur()
      }
    },
    [handleConceptSelect, keepFocus]
  )

  const handleBlur = useCallback(
    event => {
      const selectedName = event.target.value.trim()
      if (selectedName !== '') {
        handleConceptSelect(selectedName)
      }
      onInputBlur?.(event)
    },
    [handleConceptSelect, onInputBlur]
  )

  const handleChange = useCallback(
    (_event, selectedName, reason) => {
      if (ignoreClearSelection && reason === 'clear') {
        return
      }
      handleConceptSelect(selectedName)
    },
    [handleConceptSelect, ignoreClearSelection]
  )

  const renderInput = useCallback(
    params => {
      const textField = (
        <TextField
          {...params}
          sx={{ backgroundColor: theme.palette.primary.pale }}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
        />
      )

      return selectorTooltip?.title ? (
        <KBTooltipTarget
          placement={selectorTooltip.placement}
          title={selectorTooltip.title}
          wrapperSx={{ display: 'block' }}
        >
          {textField}
        </KBTooltipTarget>
      ) : (
        textField
      )
    },
    [handleBlur, handleKeyUp, selectorTooltip, theme]
  )

  const slotProps = useMemo(
    () => ({
      paper: {
        sx: {
          '& .MuiAutocomplete-listbox': {
            '& .MuiAutocomplete-option': {
              backgroundColor: theme.palette.primary.light,
            },
          },
        },
      },
    }),
    [theme]
  )

  return (
    <Stack spacing={0} sx={{ width }}>
      {auxiliaryComponent || <ConceptSelectAuxiliary label={label} />}
      <Autocomplete
        filterOptions={filterConceptOptions}
        onChange={handleChange}
        onInputChange={onInputChange}
        options={options}
        ref={inputRef}
        renderInput={renderInput}
        size='small'
        slotProps={slotProps}
        inputValue={inputValue}
        value={conceptName || ''}
      />
    </Stack>
  )
}

export default ConceptSelect
