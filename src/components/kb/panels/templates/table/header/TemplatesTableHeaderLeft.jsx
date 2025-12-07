import { use } from 'react'
import { Box } from '@mui/material'

import PanelDataExport from '@/components/common/panel/PanelDataExport'
import PanelDataSwitch from '@/components/common/panel/PanelDataSwitch'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'
import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import { CONCEPT, SELECTED } from '@/lib/constants.js'
import { UI_TEXT } from '@/config/text/index.js'

const { EXPORT } = UI_TEXT.PANELS.TEMPLATES.TOOLTIP
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
