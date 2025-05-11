import { Button } from '@mui/material'
import { IoClose } from 'react-icons/io5'
import { LiaHandPointer } from 'react-icons/lia'

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
        <LiaHandPointer style={{ transform: 'rotate(90deg)', fontSize: '1.2rem' }} />
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
      <IoClose />
    </Button>
  )
}

export default ChangeActionButton
