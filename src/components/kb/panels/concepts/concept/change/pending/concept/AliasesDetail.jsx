import { use } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import AliasDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/AliasDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { otherApprovalSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { ALIASES } = PENDING.GROUP

const AliasesDetail = ({ pendingField }) => {
  const { concept } = use(ConceptContext)

  const pendingAliases = pendingField('ConceptName').filter(
    alias => alias.newValue !== concept.name
  )

  const approval = usePendingGroupApproval(ALIASES)
  const aliasesSx = otherApprovalSx(approval)

  if (pendingAliases.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PendingButtons approval={approval} group={ALIASES} />
        <Typography sx={aliasesSx}>Aliases</Typography>
      </Box>
      <Stack direction='column' spacing={1}>
        {pendingAliases.map(pendingAlias => (
          <AliasDetail key={pendingAlias.id} pendingAlias={pendingAlias} />
        ))}
      </Stack>
    </Box>
  )
}

export default AliasesDetail
