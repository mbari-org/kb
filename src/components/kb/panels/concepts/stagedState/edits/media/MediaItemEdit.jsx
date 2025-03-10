import { Box, Typography } from '@mui/material'

import MediaItemReset from './MediaItemReset'
import MediaItemDetail from './MediaItemDetail'

import { fieldSx } from '@/components/common/format'

const urlFile = fields =>
  fields
    ?.find(([field, _value]) => field === 'url')?.[1]
    ?.split('/')
    .pop()

const MediaItemEdit = ({ mediaItemEdit }) => {
  const [mediaIndex, stagedAction, initialFields, stagedFields] = mediaItemEdit

  const actionText = `${stagedAction.split(' ').pop()}`
  const actionFile = urlFile(initialFields) || urlFile(stagedFields) || ''

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
      <MediaItemDetail stagedFields={stagedFields} initialFields={initialFields} />
    </Box>
  )
}

export default MediaItemEdit
