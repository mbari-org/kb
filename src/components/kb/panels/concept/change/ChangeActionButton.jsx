import { Button } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'

import HandIcon from '@/components/common/HandIcon'

const ChangeActionButton = ({ changing, color, disabled, onClick }) => {
  if (changing) {
    return (
      <Button
        color={color}
        onClick={onClick}
        sx={{
          minWidth: 'auto',
        }}
      >
        <HandIcon />
      </Button>
    )
  }

  return (
    <Button
      color={color}
      disabled={disabled}
      onClick={onClick}
      sx={{
        mr: 0.5,
        minWidth: 'auto',
      }}
    >
      <IoCloseSharp />
    </Button>
  )
}

export default ChangeActionButton
