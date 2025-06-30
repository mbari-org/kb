import { Typography } from '@mui/material'

const ActionsText = ({ color = 'cancel', text }) => (
  <Typography color={color} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
    {text}
  </Typography>
)

export default ActionsText
