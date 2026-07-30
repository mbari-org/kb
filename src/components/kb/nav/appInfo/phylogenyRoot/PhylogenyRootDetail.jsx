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
import CONFIG from '@/lib/config'

const phylogenyConfig = CONFIG.APP_INFO.PHYLOGENY_ROOT ?? CONFIG.APP_INFO.PHLOGENY_ROOT
const { EDIT, FIELD_LABEL } = phylogenyConfig
const { TITLE, TOOLTIP } = EDIT

const PhylogenyRootDetail = ({ conceptNames = [], getConceptPrimaryName, onEditComplete }) => {
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
      onCancel: onEditComplete,
      selectedPhylogenyRoot: phylogenyRoot,
      getConceptPrimaryName,
    })

    const modal = createAppModal({
      Actions: PhylogenyRootActions,
      Content: () => <PhylogenyRootContent conceptNames={conceptNames} />,
      Title: () => <Title title={TITLE} />,
      focusClose: true,
      width: '50%',
    })

    setModal(modal)
  }

  return (
    <AppInfoDetail
      editTooltip={TOOLTIP}
      label={FIELD_LABEL}
      onEdit={isAdminUser ? handleEditPhylogenyRoot : undefined}
      value={phylogenyRoot}
    />
  )
}

export default PhylogenyRootDetail
