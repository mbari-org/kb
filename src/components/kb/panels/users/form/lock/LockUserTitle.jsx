import { use } from 'react'

import Title from '@/components/common/factory/Title'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

const LockUserTitle = () => {
  const { modalData } = use(HOLDModalContext)
  const { user } = modalData

  return <Title title={user.locked ? 'Unlock User' : 'Lock User'} />
}

export default LockUserTitle
