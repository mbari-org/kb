import { use } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import AliasDetail from '@/components/kb/panels/concepts/change/pending/concept/AliasDetail'
import PendingButtons from '@/components/kb/panels/concepts/change/pending/PendingButtons'

import ConceptContext from '@/contexts/concept/ConceptContext'

import usePendingApproval from '@/components/kb/panels/concepts/change/pending/usePendingApproval'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { ALIASES } = PENDING.GROUP

const AliasesDetail = ({ pendingField }) => {
  const { concept } = use(ConceptContext)

  const pendingAliases = pendingField('ConceptName').filter(
    alias => alias.newValue !== concept.name
  )

  const approval = usePendingApproval(pending => pending === ALIASES)

  const aliasesSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

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
        <PendingButtons approval={approval} pending={ALIASES} />
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
