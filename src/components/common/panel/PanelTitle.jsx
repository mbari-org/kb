import { Typography } from '@mui/material'

const PanelTitle = ({ title }) => {
  return (
    <Typography component='div' align='center' sx={{ fontSize: '2.25rem' }}>
      {title}
    </Typography>
  )
}

export default PanelTitle
