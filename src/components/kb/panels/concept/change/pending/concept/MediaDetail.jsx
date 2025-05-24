import { Box, Stack, Typography } from '@mui/material'

import MediaItemDetail from '@/components/kb/panels/concept/change/pending/concept/MediaItemDetail'
import PendingButtons from '@/components/kb/panels/concept/change/pending/PendingButtons'

import usePendingApproval from '@/components/kb/panels/concept/change/pending/usePendingApproval'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { MEDIA } = PENDING.GROUP

const MediaDetail = ({ pendingField }) => {
  const pendingMedia = pendingField('Media')

  const approval = usePendingApproval(pending => pending === MEDIA)
  const mediaSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

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
        <PendingButtons approval={approval} pending={MEDIA} />
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
