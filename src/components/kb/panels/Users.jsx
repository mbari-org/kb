import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import UsersTableHeaderLeft from '@/components/kb/panels/users/table/header/UsersTableHeaderLeft'
import UsersTableData from '@/components/kb/panels/users/table/data/UsersTableData'

import usePanelFactory from '@/components/common/panel/usePanelFactory'
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
import useAddUserButton from '@/components/kb/panels/users/useAddUserButton'
>>>>>>> Stashed changes
=======
import useAddUserButton from '@/components/kb/panels/users/form/add/useAddUserButton'
>>>>>>> Stashed changes

const Users = () => {
  const { createTablePanel } = usePanelFactory()

  const AddUserButton = useAddUserButton()

  const usersPanel = createTablePanel({
    header: {
      headerTitle: <PanelHeaderTitle title='Users' />,
    },
    tableHeader: {
      headerLeft: <UsersTableHeaderLeft />,
      headerRight: <AddUserButton />,
    },
    tableData: {
      content: <UsersTableData />,
    },
  })

  return usersPanel
}

export default Users
