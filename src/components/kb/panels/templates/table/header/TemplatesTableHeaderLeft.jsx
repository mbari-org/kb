import { use } from 'react'
import { Box } from '@mui/material'

import PanelDataExport from '@/components/common/panel/PanelDataExport'
import PanelDataSwitch from '@/components/common/panel/PanelDataSwitch'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'
import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import { CONCEPT, SELECTED } from '@/lib/constants'
import CONFIG from '@/text'

const { EXPORT } = CONFIG.PANELS.TEMPLATES.EXPORT.TOOLTIP
const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const TemplatesTableHeaderLeft = () => {
  const { byAvailable, filteredTemplates, setByAvailable, filters } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const switchFn = event => setByAvailable(event.target.checked)

  const switchDisabled = filters[FILTERS.CONCEPT] === ''

  let exportTooltip
  if (filters[FILTERS.CONCEPT] && filters[FILTERS.TO_CONCEPT]) {
    exportTooltip = EXPORT.CONCEPT_TO_CONCEPT
  } else if (filters[FILTERS.CONCEPT]) {
    exportTooltip = EXPORT.CONCEPT
  } else if (filters[FILTERS.TO_CONCEPT]) {
    exportTooltip = EXPORT.TO_CONCEPT
  } else {
    exportTooltip = EXPORT.ALL
  }

  const countLabel = CONFIG.PANELS.TEMPLATES.EXPORT.TOTAL
  const exportButtonLabel = CONFIG.PANELS.TEMPLATES.EXPORT.BUTTON.EXPORT

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: CONCEPT.SELECT.WIDTH,
      }}
    >
      <PanelDataExport
        count={filteredTemplates.length}
        countLabel={countLabel}
        exportButtonLabel={exportButtonLabel}
        exportFn={templatesExport}
        exportTooltip={exportTooltip}
        width='auto'
      />
      <PanelDataSwitch
        checked={byAvailable}
        disabled={switchDisabled}
        switchFn={switchFn}
        switchLabel='Available'
        switchTooltip={<TemplatesConceptAvailableTooltip />}
      />
    </Box>
  )
}

export default TemplatesTableHeaderLeft
