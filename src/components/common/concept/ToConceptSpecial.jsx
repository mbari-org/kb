import { Button, Stack } from '@mui/material'
import theme from '@/lib/theme'

import { UI_TEXT } from '@/config/text/index.js'

const ToConceptSpecial = ({ onChange }) => {
  const buttonStyle = {
    color: 'text.secondary',
    fontSize: '1rem',
    minWidth: '32px',
    p: 0.5,
    textTransform: 'none',
    '&:hover': {
      ...theme.kb.icon.hover,
      color: theme.palette.primary.main,
    },
  }

  return (
    <Stack direction='row' spacing={1} sx={{ mt: 0.5 }}>
      {UI_TEXT.CONCEPT.TO_SPECIAL.map(value => (
        <Button
          key={value}
          onClick={() => onChange(value)}
          size='small'
          sx={{ ...buttonStyle }}
          variant='text'
        >
          {value}
        </Button>
      ))}
    </Stack>
  )
}

export default ToConceptSpecial
