import { use } from 'react'
import { Box, Typography, Stack } from '@mui/material'

import AliasAdd from '@/components/kb/panels/concepts/change/staged/concept/aliases/edit/AliasAdd'
import ConceptAlias from '@/components/kb/panels/concepts/change/staged/concept/aliases/ConceptAlias'

import ConceptContext from '@/contexts/concept/ConceptContext'

const ConceptAliases = () => {
  const { editing, stagedState } = use(ConceptContext)

  return (
    <Box display='flex' flexDirection='column'>
      <Box display='flex' alignItems='center'>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Alternate Names
        </Typography>
        {editing && <AliasAdd />}
      </Box>
      <Stack spacing={1}>
        {stagedState?.aliases?.map(alias => (
          <ConceptAlias key={alias.name || alias.index} alias={alias} />
        ))}
      </Stack>
    </Box>
  )
}

export default ConceptAliases
