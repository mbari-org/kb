import { Box, Typography } from '@mui/material'

import MediaItemReset from './MediaItemReset'
import MediaItemEditDetail from './MediaItemEditDetail'

import { fieldSx } from '@/components/common/format'
// import { mediaItemEdits } from "@/lib/kb/concept/media"

const MediaItemEdit = ({ mediaItemEdit }) => {
  const [mediaIndex, editingAction, initialFields, editingFields] = mediaItemEdit

  const actionText = `${editingAction.split(' ').pop()}`
  const initialUrl =
    initialFields
      .find(([field, _value]) => field === 'url')?.[1]
      .split('/')
      .pop() || ''

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MediaItemReset mediaIndex={mediaIndex} />
        <Typography sx={fieldSx}>
          {actionText}: {initialUrl}
        </Typography>
      </Box>
      <MediaItemEditDetail initialFields={initialFields} editingFields={editingFields} />
    </Box>
  )
}

export default MediaItemEdit
