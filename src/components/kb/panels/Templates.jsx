import TemplatesHeaderLeft from '@/components/kb/panels/templates/header/TemplatesHeaderLeft'
import TemplatesHeaderRight from '@/components/kb/panels/templates/header/TemplatesHeaderRight'
import TemplatesHeaderTitle from '@/components/kb/panels/templates/header/TemplatesHeaderTitle'
import TemplatesTableData from '@/components/kb/panels/templates/table/data/TemplatesTableData'
import TemplatesTableHeaderLeft from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderLeft'
import TemplatesTableHeaderMiddle from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderMiddle'
import TemplatesTableHeaderRight from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderRight'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

import TemplatesProvider from '@/contexts/panels/templates/TemplatesProvider'
import { useTemplatesModalOperationsContext } from '@/contexts/panels/templates/modal'

const TemplatesModalRenderer = () => {
  const { modal: templatesModal, processing: templatesProcessing } = useTemplatesModalOperationsContext()
  return (
    !templatesProcessing &&
    templatesModal &&
    typeof templatesModal === 'function' &&
    templatesModal()
  )
}

const TemplatesContent = () => {
  const { createTablePanel } = usePanelFactory()

  return createTablePanel({
    header: {
      headerLeft: <TemplatesHeaderLeft />,
      headerTitle: <TemplatesHeaderTitle />,
      headerRight: <TemplatesHeaderRight />,
    },
    tableHeader: {
      headerLeft: <TemplatesTableHeaderLeft />,
      headerMiddle: <TemplatesTableHeaderMiddle />,
      headerRight: <TemplatesTableHeaderRight />,
    },
    tableData: {
      content: <TemplatesTableData />,
    },
  })
}

const Templates = () => {
  return (
    <TemplatesProvider>
      <TemplatesContent />
      <TemplatesModalRenderer />
    </TemplatesProvider>
  )
}

export default Templates
