import { use } from 'react'

import PanelTotalExportSwitch from '@/components/common/panel/PanelTotalExportSwitch'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'
import TemplatesTableHeaderLeftSwitchTooltip from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderLeftSwitchTooltip'

import { CONCEPT_SELECT } from '@/lib/constants'
import { TEMPLATES } from '@/lib/tooltips'

const { EXPORT } = TEMPLATES

const TemplatesTableHeaderLeft = () => {
  const { count, filterConcept, filterToConcept } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const exportFn = () => {
    templatesExport({ filterConcept, filterToConcept })
  }

  const switchFn = () => {
    console.log('switchFn')
  }

  let exportToolTip
  if (filterConcept && filterToConcept) {
    exportToolTip = EXPORT.CONCEPT_TO_CONCEPT
  } else if (filterConcept) {
    exportToolTip = EXPORT.CONCEPT
  } else if (filterToConcept) {
    exportToolTip = EXPORT.TO_CONCEPT
  } else {
    exportToolTip = EXPORT.ALL
  }

  return (
    <PanelTotalExportSwitch
      count={count}
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
