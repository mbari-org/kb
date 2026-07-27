import { use, useMemo } from 'react'
import { Autocomplete, TextField } from '@mui/material'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import { SELECTED } from '@/lib/constants/selected.js'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const LinkNameInput = ({ disabled = false, onChange, value }) => {
  const { filters, filteredTemplates } = use(TemplatesContext)

  const hasFilteredConcept = Boolean(filters[FILTERS.CONCEPT])

  const linkNameOptions = useMemo(() => {
    return [...new Set(filteredTemplates.map(template => template.linkName).filter(Boolean))]
  }, [filteredTemplates])

  const setLinkNameValue = nextValue => {
    onChange({ target: { value: nextValue ?? '' } })
  }

  if (!hasFilteredConcept) {
    return (
      <TextField
        disabled={disabled}
        fullWidth
        label='Link Name'
        onChange={onChange}
        required
        size='small'
        value={value}
      />
    )
  }

  return (
    <Autocomplete
      disabled={disabled}
      freeSolo
      fullWidth
      onChange={(_, newValue) => setLinkNameValue(newValue)}
      onInputChange={(_, newInputValue) => setLinkNameValue(newInputValue)}
      options={linkNameOptions}
      renderInput={params => <TextField {...params} disabled={disabled} label='Link Name' required size='small' />}
      size='small'
      value={value}
    />
  )
}

export default LinkNameInput
