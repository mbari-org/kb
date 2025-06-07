import { Box } from '@mui/material'

const render = ({ error }) => {
  return (
    <Box role='alert'>
      <p>Whoops:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </Box>
  )
}

const reset = _details => {}

export { render, reset }
