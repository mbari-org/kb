import { use } from 'react'
import { Box, Typography, Stack } from '@mui/material'

import AliasAdd from './AliasAdd'
import ConceptAlias from './ConceptAlias'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

import ConceptContext from '@/contexts/concept/ConceptContext'
import { isEmptyAlias } from '@/lib/kb/concept/state/aliases'

const ConceptAliases = () => {
  const { editing, editingState } = use(ConceptContext)

  const lastAlias = editingState.aliases[editingState.aliases.length - 1]
  const showAddAlias = lastAlias?.action !== CONCEPT_STATE.ALIAS_ADD || !isEmptyAlias(lastAlias)

  return (
    <Box display='flex' flexDirection='column'>
      <Box display='flex' alignItems='center'>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Alternate Names
        </Typography>
        {editing && showAddAlias && <AliasAdd />}
      </Box>
      <Stack spacing={1}>
        {editingState?.aliases?.map((alias, index) => (
          <ConceptAlias key={alias.name} aliasIndex={index} />
        ))}
      </Stack>
    </Box>
  )
}

export default ConceptAliases
