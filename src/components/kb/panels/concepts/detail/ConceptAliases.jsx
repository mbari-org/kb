import { use, useMemo } from 'react'
import { Box, Typography, Stack } from '@mui/material'

import AliasAdd from '@/components/kb/panels/concepts/detail/aliases/edit/AliasAdd'
import ConceptAlias from '@/components/kb/panels/concepts/detail/ConceptAlias'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { pendingDeletedAliases } from '@/lib/kb/model/alias'
// import { orderedAliases } from '@/lib/kb/model/aliases'

const ConceptAliases = () => {
  const { editing, pendingHistory, stagedState } = use(ConceptContext)

  const stagedAliases = useMemo(
    () => stagedState?.aliases?.map((alias, index) => ({ ...alias, index })) || [],
    [stagedState?.aliases]
  )

  const cxDebug = pendingDeletedAliases(pendingHistory)
  console.log('pending alias deletes:', cxDebug)

  // const displayAliases = stagedState?.aliases || []
  // const displayAliases = orderedAliases([
  //   ...(stagedState?.aliases || []),
  //   ...pendingDeletedAliases(pendingHistory),
  // ])

  return (
    <Box display='flex' flexDirection='column'>
      <Box display='flex' alignItems='center'>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Alternate Names
        </Typography>
        {editing && <AliasAdd />}
      </Box>
      <Stack spacing={1}>
        {stagedAliases.map(alias => (
          <ConceptAlias key={alias.name || alias.index} alias={alias} />
        ))}
      </Stack>
    </Box>
  )
}

export default ConceptAliases
