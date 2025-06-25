import { use, useState, useEffect } from 'react'
import { FormControlLabel, Switch, Tooltip } from '@mui/material'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/common/ConceptPropertiesSection'

import SelectedContext from '@/contexts/selected/SelectedContext'
import KBDataContext from '@/contexts/KBDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplates = () => {
  const { getSelected, getSettings, updateSelected, updateSettings } = use(SelectedContext)
  const { templates: allTemplates, isLoading } = use(KBDataContext)
  const { getAncestors } = use(TaxonomyContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const available = getSettings(TEMPLATES.KEY, TEMPLATES.AVAILABLE)

  const [filteredTemplates, setFilteredTemplates] = useState([])

  useEffect(() => {
    if (selectedConcept && allTemplates) {
      const conceptsToInclude = available
        ? [selectedConcept, ...(getAncestors(selectedConcept) || [])]
        : [selectedConcept]
      const filtered = allTemplates.filter(template => conceptsToInclude.includes(template.concept))
      setFilteredTemplates(filtered)
    } else {
      setFilteredTemplates([])
    }
  }, [allTemplates, selectedConcept, available, getAncestors])

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
