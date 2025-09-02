import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ActionIcon from '@/components/icon/ActionIcon'

const DEFAULT_SIZE = 24

const MediaIcon = ({ Icon, color, position = 'right', size, tooltip, onClick, sx = {} }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        bottom: 28,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        [position]: 2,
        position: 'absolute',
        zIndex: 1,
        ...sx,
      }}
    >
      <ActionIcon
        color={color}
        Icon={Icon}
        onClick={onClick}
        size={size || DEFAULT_SIZE}
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: 0.5,
        }}
        tooltip={tooltip}
      />
    </Box>
  )
}

export default MediaIcon
