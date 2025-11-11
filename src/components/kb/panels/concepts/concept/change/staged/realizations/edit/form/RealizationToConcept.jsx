import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { use } from 'react'
import { FormControl, TextField, Autocomplete } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'
import { getConceptTaxa } from '@/lib/kb/api/concept'

import { CONCEPT } from '@/lib/constants.js'

const RealizationToConcept = ({
  realizationItem,
  onRealizationChange,
  isValidLinkName,
  isEdit = false,
  onValidationChange,
}) => {
  const { apiFns } = use(ConfigContext)

  const hasFetchedTaxaRef = useRef(false)

  const [taxaNames, setTaxaNames] = useState([])

  const toConcept = realizationItem.toConcept

  const isSpecial = useMemo(() => {
    return toConcept === 'self' || toConcept === 'nil'
  }, [toConcept])

  const isValidToConcept = useMemo(
    () => !toConcept || isSpecial || taxaNames.length === 0 || taxaNames.includes(toConcept),
    [toConcept, taxaNames, isSpecial]
  )

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValidToConcept)
    }
  }, [isValidToConcept, onValidationChange])

  const handleToConceptChange = useCallback(
    (_event, value) => {
      if (isSpecial) {
        return
      }
      const updatedRealizationItem = {
        ...realizationItem,
        toConcept: value,
      }
      onRealizationChange(updatedRealizationItem, 'toConcept')
    },
    [realizationItem, onRealizationChange, isSpecial]
  )

  const templateId = realizationItem.templateId
  useEffect(() => {
    hasFetchedTaxaRef.current = false
    const timeoutId = setTimeout(() => setTaxaNames([]), 0)
    return () => clearTimeout(timeoutId)
  }, [templateId])

  useEffect(() => {
    if (!apiFns || !toConcept) return

    const specialMap = CONCEPT.TO_SPECIAL.reduce((acc, val) => {
      acc[val] = [val]
      return acc
    }, {})
    if (specialMap[toConcept]) {
      const timeoutId = setTimeout(() => setTaxaNames(specialMap[toConcept]), 0)
      hasFetchedTaxaRef.current = true
      return () => clearTimeout(timeoutId)
    }

    if (!hasFetchedTaxaRef.current) {
      const fetchTaxa = async () => {
        const taxa = await apiFns.apiPayload(getConceptTaxa, toConcept)

        const names = taxa
          .flatMap(item =>
            item.alternativeNames ? [item.name].concat(item.alternativeNames) : [item.name]
          )
          .sort()

        setTaxaNames(names)
        hasFetchedTaxaRef.current = true
      }

      fetchTaxa()
    }
  }, [toConcept, apiFns])

  const renderImmutableField = () => (
    <TextField
      label='To Concept'
      value={toConcept}
      size='small'
      disabled
      sx={{
        '& .MuiInputBase-input.Mui-disabled': {
          WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
          color: 'rgba(0, 0, 0, 0.87)',
        },
        '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '& .MuiInputLabel-root.Mui-disabled': {
          color: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    />
  )

  const renderEditableField = () => (
    <Autocomplete
      options={taxaNames}
      value={toConcept}
      onChange={handleToConceptChange}
      size='small'
      disabled={!isValidLinkName}
      disableClearable={true}
      freeSolo={false}
      renderInput={params => <TextField {...params} label='To Concept' size='small' />}
    />
  )

  return (
    <FormControl fullWidth margin='normal'>
      {isEdit || isSpecial ? renderImmutableField() : renderEditableField()}
    </FormControl>
  )
}

export default RealizationToConcept
