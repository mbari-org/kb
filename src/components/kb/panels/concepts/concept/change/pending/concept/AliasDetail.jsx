import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { otherApprovalSx } from '@/components/common/format'

import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants'

const { APPROVAL, GROUP } = PENDING

const AliasDetail = ({ pendingAlias }) => {
  const approval = usePendingItemApproval(pendingAlias)

  const aliasSx = otherApprovalSx(approval)
  const disabled = approval === APPROVAL.OTHER

  const aliasTitle = pendingActionValue(pendingAlias)

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
        <PendingButtons approval={approval} group={GROUP.ALIASES} item={pendingAlias} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>{pendingAlias.action}:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{aliasTitle}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingInfo(pendingAlias)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default AliasDetail
