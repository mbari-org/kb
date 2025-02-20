import { use } from 'react'
import { MdOutlinePlaylistAdd } from 'react-icons/md'
import { Box, Typography, IconButton, Stack } from '@mui/material'

import ConceptAlias from './ConceptAlias'
import ConceptContext from '@/contexts/concept/ConceptContext'

const ConceptAliases = () => {
  const { concept, editing } = use(ConceptContext)

  return (
    <Box display='flex' flexDirection='column'>
      <Box display='flex' alignItems='center'>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Alternate Names
        </Typography>
        {editing && (
          <IconButton color='main' sx={{ '&:hover': { transform: 'scale(1.25)' }, mb: 1 }}>
            <MdOutlinePlaylistAdd />
          </IconButton>
        )}
      </Box>
      <Stack spacing={1}>
        {concept?.names?.map((alias, index) => (
          <ConceptAlias key={alias} alias={alias} index={index} />
        ))}
      </Stack>
    </Box>
  )
}

export default ConceptAliases
