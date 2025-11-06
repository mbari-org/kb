import { use, useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import ConceptPropertyPages from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyPages'
import ConceptTemplatesAvailableToggle from '@/components/kb/panels/concepts/concept/detail/templates/ConceptTemplatesAvailableToggle'
import InspectIcon from '@/components/icon/InspectIcon'
import PanelDataSwitch from '@/components/common/panel/PanelDataSwitch'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { FONT, SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplates = () => {
  const { isLoading, templates } = use(PanelDataContext)
  const { getSelected, getSettings, updateSelected, updateSettings } = use(SelectedContext)
  const { getAncestorNames } = use(TaxonomyContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const byAvailable = getSettings(TEMPLATES.KEY, TEMPLATES.BY_AVAILABLE)

  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => `${template.linkName} | ${template.toConcept} | ${template.linkValue}`,
  }

  const linkToTemplates = () => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.TEMPLATES })
    updateSettings({
      [TEMPLATES.KEY]: {
        [TEMPLATES.FILTERS.KEY]: { [TEMPLATES.FILTERS.CONCEPT]: selectedConcept },
      },
    })
  }

  const conceptTemplates = useMemo(() => {
    const ancestorNames = byAvailable ? getAncestorNames(selectedConcept) : []
    const concepts = selectedConcept ? [selectedConcept, ...ancestorNames] : null
    return filterTemplates(templates, { concepts })
  }, [byAvailable, getAncestorNames, selectedConcept, templates])

  const tooltip = `View ${byAvailable ? 'Available' : 'Explicit'} Templates for this Concept`

  const switchFn = event => {
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

  const switchToolTip = (
    <Stack direction='column' spacing={0} sx={{ fontSize: FONT.SIZE, fontFamily: FONT.FAMILY }}>
      <Typography sx={{ mb: '0.5em !important', mt: '0.25em !important', textAlign: 'center' }}>
        Available
      </Typography>
      <Stack direction='column' spacing={1}>
        <Stack direction='column' spacing={0.25}>
          <Typography color={byAvailable ? 'inherit' : 'grey.500'}>
            On: Show available templates that can be used with this concept
          </Typography>
        </Stack>
        <Stack direction='column' spacing={0.25}>
          <Typography color={byAvailable ? 'grey.500' : 'inherit'}>
            Off: Show templates explicitly defined for this concept
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )

  const ActionComponent = () => (
    <Stack direction='row' spacing={2}>
      <InspectIcon asDiv={true} onClick={linkToTemplates} tooltip={tooltip} />
      <Box sx={{ position: 'relative', top: 5 }}>
        <PanelDataSwitch
          checked={byAvailable}
          switchFn={switchFn}
          switchLabel='Available'
          switchToolTip={switchToolTip}
        />
      </Box>
    </Stack>
  )

  return (
    <ConceptPropertyPages
      actionComponent={ActionComponent}
      isLoading={isLoading}
      items={conceptTemplates}
      loadingText='Loading templates...'
      renderItem={renderItem}
      title='Templates'
    >
      <ConceptTemplatesAvailableToggle />
    </ConceptPropertyPages>
  )
}

export default ConceptTemplates
