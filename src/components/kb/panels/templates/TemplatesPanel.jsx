import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import TemplatesHeaderLeft from '@/components/kb/panels/templates/header/TemplatesHeaderLeft'
import TemplatesHeaderRight from '@/components/kb/panels/templates/header/TemplatesHeaderRight'
import TemplatesTableData from '@/components/kb/panels/templates/table/data/TemplatesTableData'
import TemplatesTableHeaderLeft from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderLeft'
import TemplatesTableHeaderRight from '@/components/kb/panels/templates/table/header/TemplatesTableHeaderRight'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

const TemplatesPanel = () => {
  const { createTablePanel } = usePanelFactory()

  return createTablePanel({
    header: {
      headerLeft: <TemplatesHeaderLeft />,
      headerTitle: <PanelHeaderTitle title='Templates' />,
      headerRight: <TemplatesHeaderRight />,
    },
    tableHeader: {
      headerLeft: <TemplatesTableHeaderLeft />,
      headerRight: <TemplatesTableHeaderRight />,
    },
    tableData: {
      content: <TemplatesTableData />,
    },
  })
}

export default TemplatesPanel
