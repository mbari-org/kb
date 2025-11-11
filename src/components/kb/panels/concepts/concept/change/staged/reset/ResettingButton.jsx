import { Button } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'

import HandIcon from '@/components/icon/HandIcon'

import { RESETTING } from '@/lib/constants/constants'

const ResettingButton = ({ color, disabled, resetting, onClick }) => {
  if (resetting === RESETTING.EXTENT.ME) {
    return (
      <Button
        onClick={onClick}
        sx={{
          color: `${color}.main`,
          minWidth: 'auto',
        }}
      >
        <HandIcon />
      </Button>
    )
  }

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      sx={{
        mr: 0.5,
        minWidth: 'auto',
        '&:hover': {
          backgroundColor: 'transparent',
          color: `${color}.main`,
          transform: 'scale(1.25)',
        },
      }}
    >
      <IoCloseSharp />
    </Button>
  )
}

export default ResettingButton
