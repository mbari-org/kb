import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'

import { TEMPLATES } from '@/lib/tooltips'

const { EXPORT } = TEMPLATES

const TemplatesTableHeaderLeft = () => {
  const { count, filterConcept, filterToConcept } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const handleExport = () => {
    templatesExport({ filterConcept, filterToConcept })
  }

  let toolTip
  if (filterConcept && filterToConcept) {
    toolTip = EXPORT.CONCEPT_TO_CONCEPT
  } else if (filterConcept) {
    toolTip = EXPORT.CONCEPT
  } else if (filterToConcept) {
    toolTip = EXPORT.TO_CONCEPT
  } else {
    toolTip = EXPORT.ALL
  }

  return <PanelTotalExport count={count} exportFn={handleExport} toolTip={toolTip} />
}

export default TemplatesTableHeaderLeft
