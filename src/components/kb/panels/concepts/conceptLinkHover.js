import { alpha } from '@mui/material/styles'

const conceptLinkHover = theme => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.3),
  fontStyle: 'italic',
})

export default conceptLinkHover
