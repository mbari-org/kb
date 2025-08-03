import { useMemo } from 'react'

import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { otherApprovalSx } from '@/components/common/format'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { ACTION, PENDING } from '@/lib/constants'

const { APPROVAL, GROUP } = PENDING

const MediaItemDetail = ({ pendingMediaItem }) => {
  const approval = usePendingItemApproval(pendingMediaItem)

  const mediaSx = otherApprovalSx(approval)
  const disabled = approval === APPROVAL.OTHER

  const mediaName = useMemo(() => {
    if (pendingMediaItem.action === ACTION.ADD) {
      return pendingMediaItem.newValue
    }
    if (pendingMediaItem.action === ACTION.DELETE) {
      return pendingMediaItem.oldValue
    }
    return ''
  }, [pendingMediaItem])

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
        <PendingButtons approval={approval} group={GROUP.MEDIA} item={pendingMediaItem} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={mediaSx}>{pendingMediaItem.action}:</Typography>
          <Typography sx={{ ...mediaSx, fontWeight: 'bold', ml: 1 }}>{mediaName}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingInfo(pendingMediaItem)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default MediaItemDetail
