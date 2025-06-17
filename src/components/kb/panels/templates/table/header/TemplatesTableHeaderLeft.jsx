import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'

const TemplatesTableHeaderLeft = () => {
  const { count, filterConcept, filterToConcept } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  const handleExport = () => {
    templatesExport({ filterConcept, filterToConcept })
  }

  return <PanelTotalExport count={count} exportFn={handleExport} />
}

export default TemplatesTableHeaderLeft
