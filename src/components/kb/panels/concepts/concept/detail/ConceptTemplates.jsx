import { use, useEffect, useState } from 'react'
import { FormControlLabel, Switch, Tooltip } from '@mui/material'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/common/ConceptPropertiesSection'

import KBDataContext from '@/contexts/kbData/KBDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplates = () => {
  const { isLoading, templates } = use(KBDataContext)
  const { getSelected, getSettings, updateSelected, updateSettings } = use(SelectedContext)
  const { getAncestors } = use(TaxonomyContext)

  const [filteredTemplates, setFilteredTemplates] = useState([])

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const available = getSettings(TEMPLATES.KEY, TEMPLATES.AVAILABLE)

  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => `${template.linkName}: ${template.toConcept} → ${template.linkValue}`,
  }

  const handleAvailableChange = event => {
    const newValue = event.target.checked
    updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.AVAILABLE]: newValue } })
  }

  const linkToTemplates = () => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.TEMPLATES })
    updateSettings({
      [TEMPLATES.KEY]: { [TEMPLATES.CONCEPT]: selectedConcept },
    })
  }

  useEffect(() => {
    const concepts = available
      ? [selectedConcept, ...(getAncestors(selectedConcept) || [])]
      : selectedConcept
    setFilteredTemplates(filterTemplates(templates, concepts))
  }, [available, getAncestors, selectedConcept, templates])

  return (
    <ConceptPropertiesSection
      isLoading={isLoading}
      items={filteredTemplates}
      loadingText='Loading templates...'
      onInspect={linkToTemplates}
      renderItem={renderItem}
      title='Templates'
    >
      <Tooltip
        title={
          available
            ? 'Show available templates that can be used with this concept'
            : 'Show templates that are explicitly defined for this concept'
        }
        placement='top'
      >
        <FormControlLabel
          control={<Switch checked={available} onChange={handleAvailableChange} size='small' />}
          label='Available'
          sx={{
            fontSize: '0.875rem',
            '& .MuiFormControlLabel-label': {
              fontSize: '0.875rem',
            },
          }}
        />
      </Tooltip>
    </ConceptPropertiesSection>
  )
}

export default ConceptTemplates
