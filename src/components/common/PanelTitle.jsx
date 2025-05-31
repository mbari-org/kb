import { Typography } from '@mui/material'

const PanelTitle = ({ title }) => {
  return (
    <Typography align='center' sx={{ mt: 3, mb: 1 }} variant='h4'>
      {title}
    </Typography>
  )
}

export default PanelTitle
