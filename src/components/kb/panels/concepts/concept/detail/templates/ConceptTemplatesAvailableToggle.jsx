import { use } from 'react'
import { FormControlLabel, Switch } from '@mui/material'

import ConceptTemplatesAvailableTooltip from '@/components/kb/panels/concepts/concept/detail/templates/ConceptTemplatesAvailableTooltip'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplatesAvailableToggle = () => {
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const available = getSettings(TEMPLATES.KEY, TEMPLATES.AVAILABLE)

  const handleAvailableChange = event => {
    const newValue = event.target.checked
    // When in concept detail context, we need to ensure the concept filter is set
    // to prevent the TemplatesProvider from resetting the available flag
    const currentFilters = getSettings(TEMPLATES.KEY, TEMPLATES.FILTERS.KEY) || {}
    updateSettings({
      [TEMPLATES.KEY]: {
        [TEMPLATES.AVAILABLE]: newValue,
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
        control={<Switch checked={available} onChange={handleAvailableChange} size='small' />}
        label='Available'
      />
    </ConceptTemplatesAvailableTooltip>
  )
}

export default ConceptTemplatesAvailableToggle
