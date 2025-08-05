import { Stack, Typography } from '@mui/material'

import MediaItemDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/MediaItemDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingGroup from '@/components/kb/panels/concepts/concept/change/pending/PendingGroup'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { otherApprovalSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { MEDIA } = PENDING.GROUP

const MediaDetail = ({ pendingField }) => {
  const pendingMedia = pendingField('Media')

  const approval = usePendingGroupApproval(MEDIA)
  const mediaSx = otherApprovalSx(approval)

  if (pendingMedia.length === 0) {
    return null
  }

  const pendingGroupTitle = (
    <>
      <PendingButtons approval={approval} group={MEDIA} />
      <Typography sx={mediaSx}>Media</Typography>
    </>
  )

  const pendingGroupDetail = (
    <Stack direction='column' spacing={1}>
      {pendingMedia.map(pendingMediaItem => (
        <MediaItemDetail key={pendingMediaItem.id} pendingMediaItem={pendingMediaItem} />
      ))}
    </Stack>
  )

  return (
    <PendingGroup pendingGroupTitle={pendingGroupTitle} pendingGroupDetail={pendingGroupDetail} />
  )
}

export default MediaDetail
