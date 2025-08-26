import { use } from 'react'

import PanelDataExportSwitch from '@/components/common/panel/PanelDataExportSwitch'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'
import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import { CONCEPT_SELECT, SELECTED } from '@/lib/constants'
import { TEMPLATES as TEMPLATES_TOOLTIPS } from '@/lib/tooltips'

const { EXPORT } = TEMPLATES_TOOLTIPS
const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesTableHeaderLeft = () => {
  const { available, filteredTemplates, setAvailable, filters } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const exportFn = () =>
    templatesExport({
      available,
      concept: filters[TEMPLATES.FILTERS.CONCEPT],
      filteredTemplates,
      toConcept: filters[TEMPLATES.FILTERS.TO_CONCEPT],
    })

  const switchFn = event => setAvailable(event.target.checked)

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
    <PanelDataExportSwitch
      checked={available}
      count={filteredTemplates.length}
      exportFn={exportFn}
      exportToolTip={exportToolTip}
      switchFn={switchFn}
      switchLabel='Available'
      switchToolTip={<TemplatesConceptAvailableTooltip />}
      width={CONCEPT_SELECT.WIDTH}
    />
  )
}

export default TemplatesTableHeaderLeft
