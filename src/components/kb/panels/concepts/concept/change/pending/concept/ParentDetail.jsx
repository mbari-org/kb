import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { usePendingParentApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { formatDelta, otherApprovalSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL

const ParentDetail = ({ pendingField }) => {
  const approval = usePendingParentApproval()

  const pendingParentArray = pendingField('Concept.parent')
  const pendingParent = pendingParentArray?.[pendingParentArray.length - 1]
  if (!pendingParent) {
    return null
  }

  const parentValue = formatDelta(pendingParent.oldValue, pendingParent.newValue)

  const aliasSx = otherApprovalSx(approval)
  const disabled = approval === OTHER

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
        <PendingButtons approval={approval} item={pendingParent} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>Parent:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{parentValue}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingInfo(pendingParent)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default ParentDetail
