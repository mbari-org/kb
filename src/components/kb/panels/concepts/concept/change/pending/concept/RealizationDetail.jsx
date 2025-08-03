import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { otherApprovalSx } from '@/components/common/format'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'

import { pendingInfo } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants'

const { APPROVAL, GROUP } = PENDING

const RealizationDetail = ({ pendingRealization }) => {
  const approval = usePendingItemApproval(pendingRealization)

  const realizationSx = otherApprovalSx(approval)
  const disabled = approval === APPROVAL.OTHER

  const realizationTitle = pendingActionValue(pendingRealization)

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', ml: 3.4 }}>
        <PendingButtons approval={approval} group={GROUP.REALIZATIONS} item={pendingRealization} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={realizationSx}>{pendingRealization.action}:</Typography>
          <Typography sx={{ ...realizationSx, fontWeight: 'bold', ml: 1 }}>
            {realizationTitle}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingInfo(pendingRealization)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default RealizationDetail
