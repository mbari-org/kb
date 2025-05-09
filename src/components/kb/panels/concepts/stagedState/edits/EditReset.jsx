import { use } from 'react'

import { Button } from '@mui/material'
import { IoClose } from 'react-icons/io5'
import { LiaHandPointer } from 'react-icons/lia'

import ConceptContext from '@/contexts/concept/ConceptContext'

const EditReset = ({ disabled, onClick, resetting }) => {
  const { confirmAction } = use(ConceptContext)

  if (resetting) {
    return (
      <Button
        color='cancel'
        onClick={onClick}
        sx={{
          minWidth: 'auto',
        }}
      >
        <LiaHandPointer style={{ transform: 'rotate(90deg)', fontSize: '1.2rem' }} />
      </Button>
    )
  }

  return (
    <Button
      color='cancel'
      disabled={confirmAction}
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

export default EditReset
