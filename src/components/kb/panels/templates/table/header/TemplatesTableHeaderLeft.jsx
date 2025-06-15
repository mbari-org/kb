import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'

const TemplatesTableHeaderLeft = () => {
  const { count } = use(TemplatesContext)

  const templatesExport = useTemplatesExport()

  return <PanelTotalExport count={count} exportFn={templatesExport} />
}

export default TemplatesTableHeaderLeft
