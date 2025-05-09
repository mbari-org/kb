import { use } from 'react'

import { Button } from '@mui/material'
import { IoClose } from 'react-icons/io5'

import ConceptContext from '@/contexts/concept/ConceptContext'

const EditReset = ({ onClick }) => {
  const { confirmAction } = use(ConceptContext)

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
