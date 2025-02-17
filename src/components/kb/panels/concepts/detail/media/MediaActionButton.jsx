import { use } from 'react'
import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'

const MediaActionButton = ({ Icon, color, action, mediaIndex, position = 'right', sx = {} }) => {
  const theme = useTheme()
  const { displayEditMedia } = use(ConceptContext)

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
        onClick={() => displayEditMedia(action, mediaIndex)}
        color={color}
        sx={{
          backgroundColor: theme.palette.background.paper,
          '&:hover': {
            backgroundColor: `${theme.palette.background.paperLight} !important`,
            transform: 'scale(1.25)',
          },
          padding: 0.5,
        }}
      >
        <Icon />
      </IconButton>
    </Box>
  )
}

export default MediaActionButton
