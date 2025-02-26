import { use } from 'react'
import { Box, Typography, Stack } from '@mui/material'

import AliasAdd from './add/AliasAdd'
import ConceptAlias from './ConceptAlias'

import ConceptContext from '@/contexts/concept/ConceptContext'

const ConceptAliases = () => {
  const { editing, editingState } = use(ConceptContext)

  return (
    <Box display='flex' flexDirection='column'>
      <Box display='flex' alignItems='center'>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Alternate Names
        </Typography>
        {editing && <AliasAdd />}
      </Box>
      <Stack spacing={1}>
        {editingState?.aliases?.map((alias, index) => (
          <ConceptAlias key={alias.name || index} aliasIndex={index} />
        ))}
      </Stack>
    </Box>
  )
}

export default ConceptAliases
