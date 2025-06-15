import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useUsersExport from '@/components/kb/panels/users/table/header/useUsersExport'

const UsersTableHeaderLeft = () => {
  const { users } = use(UsersContext)
  const usersExport = useUsersExport()

  return <PanelTotalExport count={users?.length || 0} exportFn={usersExport} />
}

export default UsersTableHeaderLeft
