import { use } from 'react'
import { FormControlLabel, Switch } from '@mui/material'

import ConceptTemplatesAvailableTooltip from '@/components/kb/panels/concepts/concept/detail/templates/ConceptTemplatesAvailableTooltip'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplatesAvailableToggle = () => {
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const byAvailable = getSettings(TEMPLATES.KEY, TEMPLATES.BY_AVAILABLE)

  const handleAvailableChange = event => {
    const value = event.target.checked
    const currentFilters = getSettings(TEMPLATES.KEY, TEMPLATES.FILTERS.KEY) || {}
    updateSettings({
      [TEMPLATES.KEY]: {
        [TEMPLATES.BY_AVAILABLE]: value,
        [TEMPLATES.FILTERS.KEY]: {
          ...currentFilters,
          [TEMPLATES.FILTERS.CONCEPT]: selectedConcept,
        },
      },
    })
  }

  return (
    <ConceptTemplatesAvailableTooltip>
      <FormControlLabel
        control={<Switch checked={byAvailable} onChange={handleAvailableChange} size='small' />}
        label='Available'
      />
    </ConceptTemplatesAvailableTooltip>
  )
}

export default ConceptTemplatesAvailableToggle
