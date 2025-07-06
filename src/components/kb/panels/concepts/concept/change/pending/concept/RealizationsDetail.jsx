import { Box, Stack, Typography } from '@mui/material'

import RealizationItemDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/RealizationItemDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'

import { useRealizationsPendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { REALIZATIONS } = PENDING.GROUP

const RealizationsDetail = ({ pendingField }) => {
  const pendingRealizations = pendingField('LinkRealization')

  const approval = useRealizationsPendingApproval()

  const realizationsSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

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
        <PendingButtons approval={approval} pending={REALIZATIONS} />
        <Typography sx={realizationsSx}>Realizations</Typography>
      </Box>
      <Stack direction='column' spacing={1}>
        {pendingRealizations.map(pendingRealization => (
          <RealizationItemDetail
            key={pendingRealization.id}
            pendingRealization={pendingRealization}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default RealizationsDetail
