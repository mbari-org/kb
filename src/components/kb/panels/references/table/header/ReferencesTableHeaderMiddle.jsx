import { useEffect, use } from 'react'
import { Button, Stack } from '@mui/material'

import TextInput from '@/components/common/TextInput'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import useDebouncedField from '@/lib/hooks/useDebouncedField'

import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

import CONFIG from '@/lib/config'

const FILTER_SETTINGS = SELECTED.SETTINGS.REFERENCES.FILTERS
const PLACEHOLDER = CONFIG.PANELS.REFERENCES.PANEL.PLACEHOLDER
const TOOLTIP = CONFIG.PANELS.REFERENCES.PANEL.TOOLTIP

const ReferencesTableHeaderMiddle = () => {
  const { filters, updateFilters } = use(ReferencesContext)

  const handleFieldChange = key => value => {
    switch (key) {
      case FILTER_SETTINGS.CONCEPTS:
        updateFilters({ [FILTER_SETTINGS.CONCEPTS]: value })
        break
      case FILTER_SETTINGS.CITATION:
        updateFilters({ [FILTER_SETTINGS.CITATION]: value })
        break
      default:
        throw new Error(`Unknown references filter key: ${key}`)
    }
  }

  const [conceptValue, handleConceptChange, setConceptValue] = useDebouncedField(
    filters[FILTER_SETTINGS.CONCEPTS],
    FILTER_SETTINGS.CONCEPTS,
    handleFieldChange
  )

  const [citationValue, handleCitationChange, setCitationValue] = useDebouncedField(
    filters[FILTER_SETTINGS.CITATION],
    FILTER_SETTINGS.CITATION,
    handleFieldChange
  )

  useEffect(() => {
    setConceptValue(filters[FILTER_SETTINGS.CONCEPTS] || '')
  }, [filters, setConceptValue])

  useEffect(() => {
    setCitationValue(filters[FILTER_SETTINGS.CITATION] || '')
  }, [filters, setCitationValue])

  const hasCitationFilter = Boolean(citationValue)
  const hasConceptsFilter = Boolean(conceptValue)
  const hasConceptFilter = Boolean(filters[FILTER_SETTINGS.CONCEPT])
  const hasExtentFilter = (filters[FILTER_SETTINGS.EXTENT] || CONCEPT.EXTENT.SOLO) !== CONCEPT.EXTENT.SOLO
  const isClearFiltersDisabled =
    !hasCitationFilter && !hasConceptsFilter && !hasConceptFilter && !hasExtentFilter
  const handleClearFilters = () => {
    updateFilters(null)
  }

  return (
    <Stack direction='row' spacing={5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <KBTooltipTarget title={TOOLTIP.FILTERS.CITATION}>
        <TextInput
          onChange={handleCitationChange}
          placeholder={PLACEHOLDER.FILTERS.CITATION}
          size='small'
          sx={{ minWidth: 180 }}
          value={citationValue}
        />
      </KBTooltipTarget>
      <Button
        disabled={isClearFiltersDisabled}
        onClick={handleClearFilters}
        sx={{
          fontSize: '0.8rem',
        }}
      >
        {CONFIG.BUTTON.CLEAR_FILTERS}
      </Button>
      <KBTooltipTarget title={TOOLTIP.FILTERS.CONCEPTS}>
        <TextInput
          onChange={handleConceptChange}
          placeholder={PLACEHOLDER.FILTERS.CONCEPTS}
          size='small'
          sx={{ minWidth: 180 }}
          value={conceptValue}
        />
      </KBTooltipTarget>
    </Stack>
  )
}

export default ReferencesTableHeaderMiddle
