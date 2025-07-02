import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import UsersTableHeaderLeft from '@/components/kb/panels/users/table/header/UsersTableHeaderLeft'
import UsersTableData from '@/components/kb/panels/users/table/data/UsersTableData'

import usePanelFactory from '@/components/common/panel/usePanelFactory'
import useAddUserButton from '@/components/kb/panels/users/form/useAddUserButton'
import UsersProvider from '@/contexts/panels/users/UsersProvider'
import { useUsersModalOperationsContext } from '@/contexts/panels/users/modal'

const UsersModalRenderer = () => {
  const { modal: usersModal, processing: usersProcessing } = useUsersModalOperationsContext()
  return (
    !usersProcessing &&
    usersModal &&
    typeof usersModal === 'function' &&
    usersModal()
  )
}

const UsersContent = () => {
  const { createTablePanel } = usePanelFactory()

  const AddUserButton = useAddUserButton()

  return createTablePanel({
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
}

const Users = () => {
  return (
    <UsersProvider>
      <UsersContent />
      <UsersModalRenderer />
    </UsersProvider>
  )
}

export default Users
