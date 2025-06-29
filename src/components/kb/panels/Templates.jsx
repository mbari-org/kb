import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import TemplatesHeaderLeft from '@/components/kb/panels/templates/header/TemplatesHeaderLeft'
import TemplatesHeaderRight from '@/components/kb/panels/templates/header/TemplatesHeaderRight'
import TemplatesTableData from '@/components/kb/panels/templates/table/data/TemplatesTableData'
import TemplatesTableHeaderLeft from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderLeft'
import TemplatesTableHeaderMiddle from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderMiddle'
import TemplatesTableHeaderRight from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderRight'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

import TemplatesProvider from '@/contexts/panels/templates/TemplatesProvider'

const Templates = () => {
  const { createTablePanel } = usePanelFactory()

  const templatesPanel = createTablePanel({
    header: {
      headerLeft: <TemplatesHeaderLeft />,
      headerTitle: <PanelHeaderTitle title='Templates' />,
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

  return <TemplatesProvider>{templatesPanel}</TemplatesProvider>
}

export default Templates
