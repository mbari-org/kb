import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useUsersExport from '@/components/kb/panels/users/table/header/useUsersExport'

import { UI_TEXT } from '@/constants/uiText.js'

const { EXPORT } = UI_TEXT.TOOLTIP.USERS

const UsersTableHeaderLeft = () => {
  const { users } = use(UsersContext)
  const usersExport = useUsersExport()

  const toolTip = EXPORT.ALL

  return <PanelDataExport count={users?.length || 0} exportFn={usersExport} exportTooltip={toolTip} width='auto' />
}

export default UsersTableHeaderLeft
