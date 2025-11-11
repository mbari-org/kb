import { use, useCallback } from 'react'
import { Box, Stack } from '@mui/material'

import ConceptTemplatesAvailableTooltip from '@/components/kb/panels/concepts/concept/detail/templates/ConceptTemplatesAvailableTooltip'
import InspectIcon from '@/components/icon/InspectIcon'
import PanelDataSwitch from '@/components/common/panel/PanelDataSwitch'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplatesActionComponent = () => {
  const { concept } = use(ConceptContext)
  const { getSettings, updateSelected, updateSettings } = use(SelectedContext)

  const byAvailable = getSettings(TEMPLATES.KEY, TEMPLATES.BY_AVAILABLE)
  const filters = getSettings(TEMPLATES.KEY, TEMPLATES.FILTERS.KEY)

  const tooltip = `View ${byAvailable ? 'Available' : 'Explicit'} Templates for this Concept`

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
          switchLabel='Available'
          switchTooltip={<ConceptTemplatesAvailableTooltip />}
        />
      </Box>
    </Stack>
  )
}

export default ConceptTemplatesActionComponent
