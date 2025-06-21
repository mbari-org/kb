import { use } from 'react'
import { Box, Typography, Stack } from '@mui/material'

import AliasAdd from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/AliasAdd'
import ConceptAlias from '@/components/kb/panels/concepts/concept/detail/aliases/ConceptAlias'
import ConceptDetailNone from '@/components/kb/panels/concepts/concept/detail/ConceptDetailNone'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const ConceptAliases = () => {
  const { editing, stagedState } = use(ConceptContext)

  const hasAliases = stagedState?.aliases?.length > 0

  return (
    <Box display='flex' flexDirection='column'>
      <Box display='flex' alignItems='center'>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Alternate Names
        </Typography>
        {editing && <AliasAdd />}
      </Box>
      {hasAliases && (
        <Stack spacing={1}>
          {stagedState?.aliases?.map(alias => (
            <ConceptAlias key={alias.name || alias.index} alias={alias} />
          ))}
        </Stack>
      )}
      <ConceptDetailNone display={!hasAliases} />
    </Box>
  )
}

export default ConceptAliases
