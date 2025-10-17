import { use } from 'react'
import { Box } from '@mui/material'

import PanelDataExport from '@/components/common/panel/PanelDataExport'
import PanelDataSwitch from '@/components/common/panel/PanelDataSwitch'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'
import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import { CONCEPT_SELECT, SELECTED } from '@/lib/constants'
import { TEMPLATES as TEMPLATES_TOOLTIPS } from '@/lib/constants'

const { EXPORT } = TEMPLATES_TOOLTIPS
const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesTableHeaderLeft = () => {
  const { byAvailable, filteredTemplates, setByAvailable, filters } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const switchFn = event => setByAvailable(event.target.checked)

  let exportToolTip
  if (filters[TEMPLATES.FILTERS.CONCEPT] && filters[TEMPLATES.FILTERS.TO_CONCEPT]) {
    exportToolTip = EXPORT.CONCEPT_TO_CONCEPT
  } else if (filters[TEMPLATES.FILTERS.CONCEPT]) {
    exportToolTip = EXPORT.CONCEPT
  } else if (filters[TEMPLATES.FILTERS.TO_CONCEPT]) {
    exportToolTip = EXPORT.TO_CONCEPT
  } else {
    exportToolTip = EXPORT.ALL
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: CONCEPT_SELECT.WIDTH,
      }}
    >
      <PanelDataExport
        count={filteredTemplates.length}
        exportFn={templatesExport}
        exportToolTip={exportToolTip}
        width='auto'
      />
      <PanelDataSwitch
        checked={byAvailable}
        switchFn={switchFn}
        switchLabel='Available'
        switchToolTip={<TemplatesConceptAvailableTooltip />}
      />
    </Box>
  )
}

export default TemplatesTableHeaderLeft
