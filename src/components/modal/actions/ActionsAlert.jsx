import { Alert } from '@mui/material'

const ActionsAlert = ({ line1, line2, severity = 'info' }) => (
  <Alert severity={severity} sx={{ textAlign: 'center' }}>
    {line1}
    <br />
    {line2}
  </Alert>
)

export default ActionsAlert
