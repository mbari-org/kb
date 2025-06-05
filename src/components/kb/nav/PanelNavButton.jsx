import { IconButton } from '@mui/material'

const PanelNavButton = ({ icon: Icon, label, ...props }) => {
  return (
    <IconButton
      color='inherit'
      aria-label={label}
      sx={{
        mr: 1,
        p: 0.5,
        mb: 1.5,
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

export default PanelNavButton
