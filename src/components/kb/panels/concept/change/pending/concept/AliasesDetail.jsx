import { use, useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import AliasDetail from '@/components/kb/panels/concept/change/pending/concept/AliasDetail'
import PendingButtons from '@/components/kb/panels/concept/change/pending/PendingButtons'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { ALIASES } = PENDING.GROUP

const AliasesDetail = ({ pendingAliases }) => {
  const { confirmPending } = use(ConceptContext)

  const approval = useMemo(() => {
    if (!confirmPending) {
      return null
    }
    if (confirmPending?.pending === ALIASES) {
      return confirmPending.approval
    }
    return OTHER
  }, [confirmPending])

  const aliasesSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

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
