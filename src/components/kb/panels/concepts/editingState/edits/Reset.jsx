import { use } from 'react'

import { Button } from '@mui/material'
import { IoClose } from 'react-icons/io5'

import ModalContext from '@/contexts/modal/ModalContext'

const Reset = ({ onClick }) => {
  const { data } = use(ModalContext)

  return (
    <Button
      color='cancel'
      disabled={data?.confirmResetFn}
      onClick={onClick}
      sx={{
        mr: 0.5,
        minWidth: 'auto',
      }}
    >
      <IoClose />
    </Button>
  )
}

export default Reset
