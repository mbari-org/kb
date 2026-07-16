import { use } from 'react'

import AppInfoDetail from '@/components/kb/nav/appInfo/AppInfoDetail'
import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import UserContext from '@/contexts/user/UserContext'
import Title from '@/components/common/factory/Title'

import MediaBaseURLActions from './MediaBaseURLActions'
import MediaBaseURLContent from './MediaBaseURLContent'

import createAppModal from '@/components/modal/app/createAppModal'
import { isAdmin } from '@/lib/auth/role'

const MediaBaseURLDetail = () => {
  const { mediaBaseUrl } = use(ConfigContext)
  const { user } = use(UserContext)
  const { closeModal, setModal, setModalData } = use(AppModalContext)

  const isAdminUser = isAdmin(user)

  const handleEditMediaBaseUrl = () => {
    const didClose = closeModal(true)
    if (!didClose) {
      return
    }

    setModalData({
      selectedMediaBaseUrl: mediaBaseUrl || '',
    })

    const modal = createAppModal({
      Actions: MediaBaseURLActions,
      Content: MediaBaseURLContent,
      Title: () => <Title title='Edit Media Base URL' />,
      minWidth: 520,
      focusClose: true,
    })

    setModal(modal)
  }

  return (
    <AppInfoDetail
      editTooltip='Edit Media Base URL'
      label='Media Base URL'
      onEdit={isAdminUser ? handleEditMediaBaseUrl : undefined}
      value={mediaBaseUrl || 'not set'}
    />
  )
}

export default MediaBaseURLDetail
