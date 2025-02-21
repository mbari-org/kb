import { Box, Typography } from '@mui/material'

import MediaItemReset from './MediaItemReset'
import MediaItemEditDetail from './MediaItemEditDetail'

import { fieldSx } from '@/components/common/format'

const urlFile = fields =>
  fields
    ?.find(([field, _value]) => field === 'url')?.[1]
    ?.split('/')
    .pop()

const MediaItemEdit = ({ mediaItemEdit }) => {
  const [mediaIndex, editingAction, initialFields, editingFields] = mediaItemEdit

  const actionText = `${editingAction.split(' ').pop()}`
  const actionFile = urlFile(initialFields) || urlFile(editingFields) || ''

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <MediaItemReset mediaIndex={mediaIndex} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={fieldSx}>{actionText}:</Typography>
          <Typography sx={{ ...fieldSx, fontWeight: 'bold', ml: 1 }}>{actionFile}</Typography>
        </Box>
      </Box>
      <MediaItemEditDetail initialFields={initialFields} editingFields={editingFields} />
    </Box>
  )
}

export default MediaItemEdit
