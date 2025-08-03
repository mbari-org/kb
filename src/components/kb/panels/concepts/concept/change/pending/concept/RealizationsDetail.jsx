import { Box, Stack, Typography } from '@mui/material'

import RealizationDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/RealizationDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { otherApprovalSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { REALIZATIONS } = PENDING.GROUP

const RealizationsDetail = ({ pendingField }) => {
  const pendingRealizations = pendingField('LinkRealization')

  const approval = usePendingGroupApproval(REALIZATIONS)
  const realizationsSx = otherApprovalSx(approval)

  if (pendingRealizations.length === 0) {
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
        <PendingButtons approval={approval} group={REALIZATIONS} />
        <Typography sx={realizationsSx}>Realizations</Typography>
      </Box>
      <Stack direction='column' spacing={1}>
        {pendingRealizations.map(pendingRealization => (
          <RealizationDetail key={pendingRealization.id} pendingRealization={pendingRealization} />
        ))}
      </Stack>
    </Box>
  )
}

export default RealizationsDetail
