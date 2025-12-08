import { use, useCallback } from 'react'
import { Box, Stack } from '@mui/material'

import ConceptTemplatesSwitchTooltip from '@/components/kb/panels/concepts/concept/detail/templates/ConceptTemplatesSwitchTooltip'
import InspectIcon from '@/components/icon/InspectIcon'
import PanelDataSwitch from '@/components/common/panel/PanelDataSwitch'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/constants/selected.js'
import { CONFIG } from '@/config/js/index.js'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplatesActionComponent = () => {
  const { concept } = use(ConceptContext)
  const { getSettings, updateSelected, updateSettings } = use(SelectedContext)

  const byAvailable = getSettings(TEMPLATES.KEY, TEMPLATES.BY_AVAILABLE)
  const filters = getSettings(TEMPLATES.KEY, TEMPLATES.FILTERS.KEY)

  const tooltip = byAvailable
    ? CONFIG.PANELS.CONCEPTS.TEMPLATES.VIEW.TOOLTIP.AVAILABLE
    : CONFIG.PANELS.CONCEPTS.TEMPLATES.VIEW.TOOLTIP.EXPLICIT

  const linkToTemplates = useCallback(() => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.TEMPLATES })
    updateSettings({
      [TEMPLATES.KEY]: {
        [TEMPLATES.FILTERS.KEY]: { [TEMPLATES.FILTERS.CONCEPT]: concept.name },
      },
    })
  }, [concept.name, updateSelected, updateSettings])

  const switchFn = event => {
    const value = event.target.checked
    updateSettings({
      [TEMPLATES.KEY]: {
        [TEMPLATES.BY_AVAILABLE]: value,
        [TEMPLATES.FILTERS.KEY]: {
          ...filters,
          [TEMPLATES.FILTERS.CONCEPT]: concept.name,
        },
      },
    })
  }

  return (
    <Stack direction='row' spacing={2}>
      <InspectIcon asDiv={true} onClick={linkToTemplates} tooltip={tooltip} />
      <Box sx={{ position: 'relative', top: 5 }}>
        <PanelDataSwitch
          checked={byAvailable}
          switchFn={switchFn}
          switchLabel={CONFIG.PANELS.CONCEPTS.TEMPLATES.SWITCH.LABEL}
          switchTooltip={<ConceptTemplatesSwitchTooltip byAvailable={byAvailable} />}
        />
      </Box>
    </Stack>
  )
}

export default ConceptTemplatesActionComponent
