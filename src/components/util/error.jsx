import { Box } from '@mui/material'

import CONFIG from '@/lib/config'

const render = ({ error }) => {
  return (
    <Box role='alert'>
      <p>{CONFIG.UI.ERROR.WHOOPS}</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </Box>
  )
}

const reset = _details => {}

export { render, reset }
