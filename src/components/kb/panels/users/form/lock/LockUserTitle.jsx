import { use } from 'react'

import Title from '@/components/modal/Title'

import PanelModalContext from '@/contexts/modal/PanelModalContext'

const LockUserTitle = () => {
  const { modalData } = use(PanelModalContext)
  const { user } = modalData

  return <Title title={user.locked ? 'Unlock User' : 'Lock User'} />
}

export default LockUserTitle
