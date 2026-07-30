import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useUsersExport from '@/components/kb/panels/users/table/header/useUsersExport'

import CONFIG from '@/lib/config'

const { BUTTON } = CONFIG
const { TOOLTIP } = CONFIG.PANELS.USERS.PANEL
const { TOTAL } = CONFIG.EXPORT

const UsersTableHeaderLeft = () => {
  const { users } = use(UsersContext)
  const usersExport = useUsersExport()

  return (
    <PanelDataExport
      count={users?.length || 0}
      countLabel={TOTAL}
      exportButtonLabel={BUTTON.EXPORT}
      exportFn={usersExport}
      exportTooltip={TOOLTIP.EXPORT.ALL}
      width='auto'
    />
  )
}

export default UsersTableHeaderLeft
