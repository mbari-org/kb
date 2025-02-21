import { use } from 'react'
import { MdOutlinePlaylistAdd } from 'react-icons/md'
import { Box, Typography, IconButton, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ConceptAlias from './ConceptAlias'
import ConceptContext from '@/contexts/concept/ConceptContext'

const ConceptAliases = () => {
  const theme = useTheme()

  const { concept, editing } = use(ConceptContext)

  return (
    <Box display='flex' flexDirection='column'>
      <Box display='flex' alignItems='center'>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Alternate Names
        </Typography>
        {editing && (
          <IconButton
            color='main'
            sx={{
              '&:hover': {
                ...theme.kb.icon.hover,
              },
              backgroundColor: theme.palette.background.paper,
              mb: 1,
            }}
          >
            <MdOutlinePlaylistAdd />
          </IconButton>
        )}
      </Box>
      <Stack spacing={1}>
        {concept?.names?.map((alias, index) => (
          <ConceptAlias key={alias.name} alias={alias} index={index} />
        ))}
      </Stack>
    </Box>
  )
}

export default ConceptAliases
