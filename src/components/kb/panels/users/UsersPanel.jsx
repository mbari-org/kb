import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import UsersTableHeaderLeft from './table/header/UsersTableHeaderLeft'
import UsersTableHeaderRight from './table/header/UsersTableHeaderRight'
import UsersTableData from './table/data/UsersTableData'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

const UsersPanel = () => {
  const { createTablePanel } = usePanelFactory()

  return createTablePanel({
    header: {
      headerTitle: <PanelHeaderTitle title='Users' />,
    },
    tableHeader: {
      headerLeft: <UsersTableHeaderLeft />,
      headerRight: <UsersTableHeaderRight />,
    },
    tableData: {
      content: <UsersTableData />,
    },
  })
}

export default UsersPanel
