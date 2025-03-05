import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import useEditMedia from '@/contexts/concept/lib/edit/useEditMedia'

const MediaActionButton = ({ Icon, action, color, position = 'right', sx = {} }) => {
  const theme = useTheme()

  const editMedia = useEditMedia(action)

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
      <IconButton
        onClick={editMedia}
        color={color}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
          },
          backgroundColor: theme.palette.background.paper,
          padding: 0.5,
        }}
      >
        <Icon />
      </IconButton>
    </Box>
  )
}

export default MediaActionButton
