import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'

import { EXPORT } from '@/lib/tooltips'

const TEMPLATES = EXPORT.TEMPLATES

const TemplatesTableHeaderLeft = () => {
  const { count, filterConcept, filterToConcept } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const handleExport = () => {
    templatesExport({ filterConcept, filterToConcept })
  }

  let toolTip
  if (filterConcept && filterToConcept) {
    toolTip = TEMPLATES.CONCEPT_TO_CONCEPT
  } else if (filterConcept) {
    toolTip = TEMPLATES.CONCEPT
  } else if (filterToConcept) {
    toolTip = TEMPLATES.TO_CONCEPT
  } else {
    toolTip = TEMPLATES.ALL
  }

  return <PanelTotalExport count={count} exportFn={handleExport} toolTip={toolTip} />
}

export default TemplatesTableHeaderLeft
