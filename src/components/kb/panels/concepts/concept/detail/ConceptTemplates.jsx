import { use, useState, useEffect, useCallback } from 'react'
import { FormControlLabel, Switch, Tooltip } from '@mui/material'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/common/ConceptPropertiesSection'

import ConfigContext from '@/contexts/config/ConfigContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { getAvailableTemplates, getExplicitTemplates } from '@/lib/api/linkTemplates'
import { SELECTED } from '@/lib/constants'

const ConceptTemplates = () => {
  const { apiFns } = use(ConfigContext)
  const { getSelected, select } = use(SelectedContext)

  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const available = getSelected(SELECTED.SETTINGS.TEMPLATES.AVAILABLE)

  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => `${template.linkName}: ${template.toConcept} → ${template.linkValue}`,
  }

  const loadTemplates = useCallback(async () => {
    if (!apiFns || !selectedConcept) {
      setTemplates([])
      return
    }

    setIsLoading(true)
    try {
      const conceptTemplates = await apiFns.apiPayload(
        available ? getAvailableTemplates : getExplicitTemplates,
        selectedConcept
      )
      setTemplates(conceptTemplates)
    } catch (error) {
      console.error('Error loading concept templates:', error)
      setTemplates([])
    } finally {
      setIsLoading(false)
    }
  }, [apiFns, selectedConcept, available])

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const handleAvailableChange = event => {
    const newValue = event.target.checked
    select({
      [SELECTED.SETTINGS.TEMPLATES.KEY]: { [SELECTED.SETTINGS.TEMPLATES.AVAILABLE]: newValue },
    })
  }

  const linkToTemplates = () => {
    select({
      templates: {
        [SELECTED.SETTINGS.TEMPLATES.CONCEPT]: selectedConcept,
      },
      [SELECTED.PANEL]: SELECTED.PANELS.TEMPLATES,
    })
  }

  return (
    <ConceptPropertiesSection
      isLoading={isLoading}
      items={templates}
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
