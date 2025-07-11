import { Alert } from '@mui/material'

const ActionsAlert = ({ line1, line2, severity = 'info' }) => (
  <Alert severity={severity}>
    {line1}
    <br />
    {line2}
  </Alert>
)

export default ActionsAlert
