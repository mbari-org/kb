import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useUsersExport from '@/components/kb/panels/users/table/header/useUsersExport'

import { EXPORT } from '@/lib/tooltips'

const USERS = EXPORT.USERS

const UsersTableHeaderLeft = () => {
  const { users } = use(UsersContext)
  const usersExport = useUsersExport()

  const toolTip = USERS.ALL

  return <PanelTotalExport count={users?.length || 0} exportFn={usersExport} toolTip={toolTip} />
}

export default UsersTableHeaderLeft
