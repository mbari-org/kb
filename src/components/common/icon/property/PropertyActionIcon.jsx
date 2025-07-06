import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const PropertyActionIcon = ({ color, Icon, onClick, size = 24, sx = {} }) => {
  const theme = useTheme()

  return (
    <Box
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      role='button'
      tabIndex={0}
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        padding: 0.5,
        position: 'static',
        zIndex: 1,
        '&:focus': {
          outline: '2px solid',
          outlineColor: color,
          outlineOffset: '1px',
        },
        '&:hover': {
          ...theme.kb.icon.hover,
          color,
        },
        ...sx,
      }}
    >
      <Icon size={size} />
    </Box>
  )
}

export default PropertyActionIcon
