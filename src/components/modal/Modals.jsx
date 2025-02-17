import { use } from 'react'

import KbModal from './KbModal'
import KbLoading from './KbLoading'

import ModalContext from '@/contexts/modal/ModalContext'

const Modals = () => {
  const { loading, modal } = use(ModalContext)

  return (
    <>
      {modal && <KbModal modal={modal} />}
      {loading && <KbLoading loading={loading} />}
    </>
  )
}

export default Modals
