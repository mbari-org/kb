import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useUsersExport from '@/components/kb/panels/users/table/header/useUsersExport'

import CONFIG from '@/text'

const UsersTableHeaderLeft = () => {
  const { users } = use(UsersContext)
  const usersExport = useUsersExport()

  const toolTip = CONFIG.PANELS.USERS.EXPORT.TOOLTIP.EXPORT.ALL
  const countLabel = CONFIG.PANELS.USERS.EXPORT.TOTAL
  const exportButtonLabel = CONFIG.PANELS.USERS.EXPORT.BUTTON.EXPORT

  return (
    <PanelDataExport
      count={users?.length || 0}
      countLabel={countLabel}
      exportButtonLabel={exportButtonLabel}
      exportFn={usersExport}
      exportTooltip={toolTip}
      width='auto'
    />
  )
}

export default UsersTableHeaderLeft
