import { Box, IconButton, useTheme } from '@mui/material'
const PendingButton = ({ Icon, color, disabled, onClick }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1,
      }}
    >
      <IconButton
        color={color}
        disabled={disabled}
        onClick={onClick}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
          },
          '& .MuiIconButton-root': {
            backgroundColor: color,
            '&:hover': {
              backgroundColor: `${color} !important`,
            },
            mb: 1,
          },
          backgroundColor: theme.palette.background.paper,
          padding: 0.5,
        }}
      >
        <Icon size={20} />
      </IconButton>
    </Box>
  )
}

export default PendingButton
