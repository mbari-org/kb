import { use } from 'react'

import { Stack } from '@mui/material'

import createAppModal from '@/components/modal/app/createAppModal'

import UserContext from '@/contexts/user/UserContext'
import useUnsafeAction from '@/contexts/user/useUnsafeAction'
import AppModalContext from '@/contexts/app/AppModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { UNSAFE_ACTION } from '@/lib/constants/unsafeAction.js'
import LogoutIcon from '@/components/icon/LogoutIcon'
import RefreshAppIcon from '@/components/icon/RefreshAppIcon'
import InfoIcon from '@/components/icon/InfoIcon'
import AppInfoContent from '@/components/kb/nav/appInfo/AppInfoContent'
import AppInfoTitle from '@/components/kb/nav/appInfo/AppInfoTitle'
import RefreshContext from '@/contexts/refresh/RefreshContext'

const ICON_SIZE = 22

const UserActions = () => {
  const { logout } = use(UserContext)
  const { guardUnsafeAction } = useUnsafeAction()
  const { setModal } = use(AppModalContext)
  const { getConceptPrimaryName, getNames } = use(TaxonomyContext)

  const handleAppInfo = () => {
    const conceptNames = getNames() || []
    const modal = createAppModal({
      Content: () => <AppInfoContent conceptNames={conceptNames} getConceptPrimaryName={getConceptPrimaryName} />,
      Title: AppInfoTitle,
      minWidth: 520,
      focusClose: true,
      contentSx: { '&:last-child': { pb: 0 } },
    })
    setModal(modal)
  }

  const handleLogout = () => {
    guardUnsafeAction({ onSafe: logout, type: UNSAFE_ACTION.LOGOUT })
  }

  const { refresh } = use(RefreshContext)

  const handleRefresh = async () => {
    await guardUnsafeAction({ onSafe: refresh, type: UNSAFE_ACTION.REFRESH })
  }

  return (
    <Stack alignItems='center' direction='row' spacing={1} sx={{ mt: -1.5 }}>
      <InfoIcon onClick={handleAppInfo} size={ICON_SIZE} tooltip='App Info' />
      <RefreshAppIcon onClick={handleRefresh} size={ICON_SIZE} tooltip='Refresh Data' />
      <LogoutIcon onClick={handleLogout} size={ICON_SIZE} tooltip='Logout' />
    </Stack>
  )
}

export default UserActions
