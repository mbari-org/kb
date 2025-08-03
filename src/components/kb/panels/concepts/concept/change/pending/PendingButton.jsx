import { Box, IconButton, useTheme } from '@mui/material'

const PendingButton = ({ Icon, color, determined, disabled, onClick }) => {
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
        disabled={disabled}
        onClick={onClick}
        sx={{
          '&:hover': determined
            ? {}
            : {
                ...theme.kb.icon.hover,
                color: `${color}.main`,
                transform: 'scale(1.25)',
              },
          backgroundColor: theme.palette.background.paper,
          color: determined ? `${color}.main` : undefined,
          padding: 0.5,
        }}
      >
        <Icon size={20} />
      </IconButton>
    </Box>
  )
}

export default PendingButton
