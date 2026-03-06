import { use } from 'react'

import AppInfoDetail from '@/components/kb/nav/appInfo/AppInfoDetail'
import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import UserContext from '@/contexts/user/UserContext'
import Title from '@/components/common/factory/Title'

import PhylogenyRootActions from './PhylogenyRootActions'
import PhylogenyRootContent from './PhylogenyRootContent'

import createAppModal from '@/components/modal/app/createAppModal'
import { isAdmin } from '@/lib/auth/role'

const PhylogenyRootDetail = ({ conceptNames = [], getConceptPrimaryName }) => {
  const { phylogenyRoot } = use(ConfigContext)
  const { user } = use(UserContext)
  const { closeModal, setModal, setModalData } = use(AppModalContext)

  const isAdminUser = isAdmin(user)

  const handleEditPhylogenyRoot = () => {
    const didClose = closeModal(true)
    if (!didClose) {
      return
    }
    setModalData({
      selectedPhylogenyRoot: phylogenyRoot,
      getConceptPrimaryName,
    })

    const modal = createAppModal({
      Actions: PhylogenyRootActions,
      Content: () => <PhylogenyRootContent conceptNames={conceptNames} />,
      Title: () => <Title title='Edit Phylogeny Root' />,
      minWidth: 520,
      focusClose: true,
    })

    setModal(modal)
  }

  return (
    <AppInfoDetail
      editTooltip='Edit Phylogeny Root'
      label='Phylogeny Root'
      onEdit={isAdminUser ? handleEditPhylogenyRoot : undefined}
      value={phylogenyRoot}
    />
  )
}

export default PhylogenyRootDetail
