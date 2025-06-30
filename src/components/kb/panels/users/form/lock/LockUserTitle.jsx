import { use } from 'react'

import Title from '@/components/common/factory/Title'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const LockUserTitle = () => {
  const { modalData } = use(PanelModalContext)
  const { user } = modalData

  return <Title title={user.locked ? 'Unlock User' : 'Lock User'} />
}

export default LockUserTitle
