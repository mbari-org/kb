import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { use } from 'react'
import { FormControl, TextField, Autocomplete } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import { getConceptTaxa } from '@/lib/api/concept'

import CONFIG from '@/lib/config'

const RealizationToConcept = ({
  realizationItem,
  onRealizationChange,
  isValidLinkName,
  onValidationChange,
}) => {
  const { apiFns } = use(ConfigContext)
  const { getNames } = use(TaxonomyContext)

  const hasFetchedTaxaRef = useRef(false)

  const [taxaNames, setTaxaNames] = useState([])

  const toConcept = realizationItem.toConcept

  const isSpecial = useMemo(() => {
    return CONFIG.CONCEPT.TO_SPECIAL.includes(toConcept)
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
      const updatedRealizationItem = {
        ...realizationItem,
        toConcept: value,
      }
      onRealizationChange(updatedRealizationItem, 'toConcept')
    },
    [realizationItem, onRealizationChange]
  )

  const templateId = realizationItem.templateId
  useEffect(() => {
    hasFetchedTaxaRef.current = false
    const timeoutId = setTimeout(() => setTaxaNames([]), 0)
    return () => clearTimeout(timeoutId)
  }, [templateId])

  useEffect(() => {
    if (!apiFns || !toConcept) return

    const specialMap = CONFIG.CONCEPT.TO_SPECIAL.reduce((acc, val) => {
      acc[val] = [val]
      return acc
    }, {})
    if (specialMap[toConcept]) {
      const timeoutId = setTimeout(() => setTaxaNames([...getNames(), ...CONFIG.CONCEPT.TO_SPECIAL]), 0)
      hasFetchedTaxaRef.current = true
      return () => clearTimeout(timeoutId)
    }

    if (!hasFetchedTaxaRef.current) {
      const fetchTaxa = async () => {
        const taxa = await apiFns.apiPayload(getConceptTaxa, toConcept)

        const names = taxa
          .flatMap(item => (item.alternativeNames ? [item.name].concat(item.alternativeNames) : [item.name]))
          .sort()

        setTaxaNames(names)
        hasFetchedTaxaRef.current = true
      }

      fetchTaxa()
    }
  }, [toConcept, apiFns, getNames])

  const renderEditableField = () => (
    <Autocomplete
      options={taxaNames}
      value={toConcept}
      onChange={handleToConceptChange}
      size='small'
      disabled={!isValidLinkName}
      disableClearable={true}
      freeSolo={false}
      renderInput={params => <TextField {...params} label={CONFIG.LINK.FIELDS.TO_CONCEPT} size='small' />}
    />
  )

  return (
    <FormControl fullWidth margin='normal'>
      {renderEditableField()}
    </FormControl>
  )
}

export default RealizationToConcept
