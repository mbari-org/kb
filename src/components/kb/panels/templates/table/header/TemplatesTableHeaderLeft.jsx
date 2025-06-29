import { use } from 'react'

import PanelTotalExportSwitch from '@/components/common/panel/PanelTotalExportSwitch'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'
import TemplatesTableHeaderLeftSwitchTooltip from '@/components/kb/panels/templates/table/header/left/TemplatesTableHeaderLeftSwitchTooltip'

import { CONCEPT_SELECT } from '@/lib/constants'
import { TEMPLATES as TEMPLATES_TOOLTIPS } from '@/lib/tooltips'

const { EXPORT } = TEMPLATES_TOOLTIPS

const TemplatesTableHeaderLeft = () => {
  const { available, concept, filteredTemplates, setAvailable, toConcept } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const exportFn = () => templatesExport({ available, concept, filteredTemplates, toConcept })

  const switchFn = event => setAvailable(event.target.checked)

  let exportToolTip
  if (concept && toConcept) {
    exportToolTip = EXPORT.CONCEPT_TO_CONCEPT
  } else if (concept) {
    exportToolTip = EXPORT.CONCEPT
  } else if (toConcept) {
    exportToolTip = EXPORT.TO_CONCEPT
  } else {
    exportToolTip = EXPORT.ALL
  }

  return (
    <PanelTotalExportSwitch
      checked={available}
      count={filteredTemplates.length}
      exportFn={exportFn}
      exportToolTip={exportToolTip}
      switchFn={switchFn}
      switchLabel='Available'
      switchToolTip={<TemplatesTableHeaderLeftSwitchTooltip />}
      width={CONCEPT_SELECT.WIDTH}
    />
  )
}

export default TemplatesTableHeaderLeft
