import { use } from 'react'

import PanelTotalExportSwitch from '@/components/common/panel/PanelTotalExportSwitch'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'
import TemplatesTableHeaderLeftSwitchTooltip from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderLeftSwitchTooltip'

import { CONCEPT_SELECT, SELECTED } from '@/lib/constants'
import { TEMPLATES as TEMPLATES_TOOLTIPS } from '@/lib/tooltips'

const { EXPORT } = TEMPLATES_TOOLTIPS

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesTableHeaderLeft = () => {
  const { select } = use(SelectedContext)
  const { count, filterConcept, filterToConcept } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const exportFn = () => {
    templatesExport({ filterConcept, filterToConcept })
  }

  const switchFn = event => {
    const newValue = event.target.checked
    select({ [TEMPLATES.KEY]: { [TEMPLATES.AVAILABLE]: newValue } })
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
