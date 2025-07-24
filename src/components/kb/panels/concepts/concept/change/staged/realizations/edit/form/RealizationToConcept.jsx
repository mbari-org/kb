import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { use } from 'react'
import { FormControl, TextField, Autocomplete } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'
import { getConceptTaxa } from '@/lib/api/concept'

const RealizationToConcept = ({
  realizationItem,
  onRealizationChange,
  isValidLinkName,
  isEditMode = false,
  onValidationChange,
}) => {
  const { apiFns } = use(ConfigContext)

  const [taxaNames, setTaxaNames] = useState([])
  const hasFetchedTaxaRef = useRef(false)

  const toConcept = realizationItem.toConcept

  // a toConcept with only one option cannot be changed
  const isSelfOrNil = useMemo(() => {
    return toConcept === 'self' || toConcept === 'nil'
  }, [toConcept])

  // Check if current toConcept value is valid (in the taxa list)
  const isValidToConcept = useMemo(() => {
    if (!toConcept || isSelfOrNil) return true
    return taxaNames.length === 0 || taxaNames.includes(toConcept)
  }, [toConcept, taxaNames, isSelfOrNil])

  // Notify parent of validation status
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValidToConcept)
    }
  }, [isValidToConcept, onValidationChange])

  const handleToConceptChange = useCallback(
    (event, value) => {
      if (isSelfOrNil) {
        return
      }
      const updatedRealizationItem = {
        ...realizationItem,
        toConcept: value,
      }
      onRealizationChange(updatedRealizationItem, 'toConcept')
    },
    [realizationItem, onRealizationChange, isSelfOrNil]
  )

  // Reset taxa fetch flag when template changes (indicated by templateId change)
  const templateId = realizationItem.templateId
  useEffect(() => {
    hasFetchedTaxaRef.current = false
    setTaxaNames([])
  }, [templateId])

  useEffect(() => {
    if (!apiFns || !toConcept) return

    const specialMap = {
      self: ['self'],
      nil: ['nil'],
    }
    if (specialMap[toConcept]) {
      setTaxaNames(specialMap[toConcept])
      hasFetchedTaxaRef.current = true
      return
    }

    // Only fetch taxa once when form is initially populated
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
      {isEditMode || isSelfOrNil ? renderImmutableField() : renderEditableField()}
    </FormControl>
  )
}

export default RealizationToConcept
