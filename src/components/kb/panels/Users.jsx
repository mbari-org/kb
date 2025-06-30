import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import UsersTableHeaderLeft from '@/components/kb/panels/users/table/header/UsersTableHeaderLeft'
import UsersTableHeaderRight from '@/components/kb/panels/users/table/header/UsersTableHeaderRight'
import UsersTableData from '@/components/kb/panels/users/table/data/UsersTableData'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

const Users = () => {
  const { createTablePanel } = usePanelFactory()

  const usersPanel = createTablePanel({
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

  return usersPanel
}

export default Users
