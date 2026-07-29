import { use } from 'react'

import AppInfoDetail from '@/components/kb/nav/appInfo/AppInfoDetail'
import AppModalContext from '@/contexts/app/AppModalContext'
import Title from '@/components/common/factory/Title'

import createAppModal from '@/components/modal/app/createAppModal'

import UserContext from '@/contexts/user/UserContext'
import { isAdmin } from '@/lib/auth/role'

import CONFIG from '@/lib/config'

const BaseURLDetail = ({ Actions, Content, baseUrl, editTooltip, label, modalDataValueKey, onEditComplete, title }) => {
  const { user } = use(UserContext)
  const { closeModal, setModal, setModalData } = use(AppModalContext)

  const isAdminUser = isAdmin(user)

  const handleEdit = () => {
    const didClose = closeModal(true)
    if (!didClose) {
      return
    }

    setModalData({
      onCancel: onEditComplete,
      [modalDataValueKey]: baseUrl || '',
    })

    const modal = createAppModal({
      Actions,
      Content,
      Title: () => <Title title={title} />,
      minWidth: 520,
      focusClose: true,
    })

    setModal(modal)
  }

  return (
    <AppInfoDetail
      editTooltip={editTooltip}
      label={label}
      onEdit={isAdminUser ? handleEdit : undefined}
      value={baseUrl || CONFIG.APP_INFO.BASE_URL.NONE}
    />
  )
}

export default BaseURLDetail
