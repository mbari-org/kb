import { Box, Stack, Typography } from '@mui/material'

import MediaItemDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/MediaItemDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'

import { usePendingMediaApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { otherApprovalSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { MEDIA } = PENDING.GROUP

const MediaDetail = ({ pendingField }) => {
  const pendingMedia = pendingField('Media')

  const approval = usePendingMediaApproval()
  const mediaSx = otherApprovalSx(approval)

  if (pendingMedia.length === 0) {
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
        <PendingButtons approval={approval} group={MEDIA} />
        <Typography sx={mediaSx}>Media</Typography>
      </Box>
      <Stack direction='column' spacing={1}>
        {pendingMedia.map(pendingMediaItem => (
          <MediaItemDetail key={pendingMediaItem.id} pendingMediaItem={pendingMediaItem} />
        ))}
      </Stack>
    </Box>
  )
}

export default MediaDetail
