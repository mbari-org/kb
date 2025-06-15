import { use } from 'react'

import Title from '@/components/modal/Title'

import ModalContext from '@/contexts/modal/ModalContext'

const LockUserTitle = () => {
  const { modalData } = use(ModalContext)
  const { user } = modalData

  return <Title title={user.locked ? 'Unlock User' : 'Lock User'} />
}

export default LockUserTitle
