import { IconButton } from '@mui/material'

const HistoryNavButton = ({ icon: Icon, label, ...props }) => {
  return (
    <IconButton
      color='inherit'
      aria-label={label}
      sx={{
        '& svg': {
          fontSize: '1.1rem',
        },
      }}
      {...props}
    >
      <Icon />
    </IconButton>
  )
}

export default HistoryNavButton
