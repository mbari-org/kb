import { use, useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'

import { useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'
import ConfigContext from '@/contexts/config/ConfigContext'
import { getDescendantNames } from '@/lib/model/concept'
const TO_NIL = 'nil'
const TO_SELF = 'self'

const LinkValueInput = ({ disabled = false, onChange, value }) => {
  const { apiFns } = use(ConfigContext)
  const { modalData } = useTemplatesModalDataContext()

  const [linkValueOptions, setLinkValueOptions] = useState([])

  const toConcept = modalData.template.toConcept

  const isToConceptSelected = toConcept !== ''
  const isToConceptNil = toConcept === TO_NIL
  const isToConceptSelf = toConcept === TO_SELF

  const linkValueConcept =
    isToConceptSelected && !isToConceptNil ? (isToConceptSelf ? modalData.template.concept : toConcept) : null

  useEffect(() => {
    const loadOptions = async () => {
      if (linkValueConcept) {
        const descendants = await getDescendantNames(apiFns, linkValueConcept)
        setLinkValueOptions([TO_NIL, ...new Set(descendants)])
      } else {
        setLinkValueOptions([])
      }
    }

    loadOptions()
  }, [apiFns, isToConceptSelected, linkValueConcept])

  useEffect(() => {
    if (linkValueOptions.length !== 1) return
    const [onlyOption] = linkValueOptions
    if (value === onlyOption) return
    onChange({ target: { value: onlyOption } })
  }, [linkValueOptions, onChange, value])

  const setLinkValue = nextValue => {
    onChange({ target: { value: nextValue ?? '' } })
  }

  if (linkValueConcept) {

    return (
      <Autocomplete
        disabled={disabled}
        freeSolo
        fullWidth
        onChange={(_, newValue) => setLinkValue(newValue)}
        onInputChange={(_, newInputValue, reason) => {
          if (reason !== 'input' && reason !== 'clear') return
          setLinkValue(newInputValue)
        }}
        options={linkValueOptions}
        renderInput={params => <TextField {...params} disabled={disabled} label='Link Value' required size='small' />}
        size='small'
        value={value || ''}
      />
    )
  }

  return (
    <TextField
      disabled={disabled}
      fullWidth
      label='Link Value'
      onChange={onChange}
      required
      size='small'
      value={value}
    />
  )
}

export default LinkValueInput
