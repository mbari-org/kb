import { use } from 'react'

import { Stack } from '@mui/material'

import UserContext from '@/contexts/user/UserContext'
import useGuardedAction from '@/contexts/user/useGuardedAction'
import { GUARDED_ACTION } from '@/lib/constants/guardedAction.js'
import LogoutIcon from '@/components/icon/LogoutIcon'
import RefreshAppIcon from '@/components/icon/RefreshAppIcon'
import InfoIcon from '@/components/icon/InfoIcon'
import useAppInfoModal from '@/components/kb/nav/appInfo/useAppInfoModal'
import RefreshContext from '@/contexts/refresh/RefreshContext'

import CONFIG from '@/lib/config'

const ICON_SIZE = 22

const UserActions = () => {
  const { logout } = use(UserContext)
  const { runGuardedAction } = useGuardedAction()
  const { openAppInfoModal } = useAppInfoModal()

  const handleLogout = () => {
    runGuardedAction({ onSafe: logout, type: GUARDED_ACTION.LOGOUT })
  }

  const { refresh } = use(RefreshContext)

  const handleRefresh = async () => {
    await runGuardedAction({ onSafe: refresh, type: GUARDED_ACTION.REFRESH })
  }

  return (
    <Stack direction='row' spacing={1} sx={{ alignItems: 'center', mt: -1.5 }}>
      <InfoIcon onClick={openAppInfoModal} size={ICON_SIZE} tooltip={CONFIG.APP_INFO.TOOLTIP} />
      <RefreshAppIcon onClick={handleRefresh} size={ICON_SIZE} tooltip='Refresh Data' />
      <LogoutIcon onClick={handleLogout} size={ICON_SIZE} tooltip='Logout' />
    </Stack>
  )
}

export default UserActions
