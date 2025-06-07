import { Box, Button, Stack } from '@mui/material'
import { IoClose } from 'react-icons/io5'
import theme from '@/lib/theme'

const ToConceptSpecial = ({ onChange, value }) => {
  const handleClick = specialValue => {
    onChange(specialValue)
  }

  const handleClear = () => {
    onChange(null)
  }

  const buttonStyle = {
    minWidth: '32px',
    p: 0.5,
    textTransform: 'none',
    fontSize: '1rem',
    color: 'text.secondary',
    '&:hover': {
      ...theme.kb.icon.hover,
      color: theme.palette.primary.main,
    },
  }

  const activeStyle = {
    color: 'primary.main',
    fontWeight: 500,
  }

  return (
    <Stack direction='row' spacing={1} sx={{ mt: 0.5 }}>
      <Button
        size='small'
        variant='text'
        onClick={() => handleClick('self')}
        sx={{ ...buttonStyle, ...(value === 'self' ? activeStyle : {}) }}
      >
        self
      </Button>
      <Button
        size='small'
        variant='text'
        onClick={() => handleClick('nil')}
        sx={{ ...buttonStyle, ...(value === 'nil' ? activeStyle : {}) }}
      >
        nil
      </Button>
      {value && (
        <Button size='small' variant='text' onClick={handleClear} sx={buttonStyle}>
          <IoClose />
        </Button>
      )}
    </Stack>
  )
}

export default ToConceptSpecial
