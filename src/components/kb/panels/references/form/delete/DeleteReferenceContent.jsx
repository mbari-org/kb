import { use } from 'react'

import { Box, Typography, Stack } from '@mui/material'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

const DeleteReferenceContent = () => {
  const { modalData } = use(HOLDModalContext)

  const fields = [
    { label: 'Citation', value: modalData?.reference?.citation },
    { label: 'DOI', value: modalData?.reference?.doi },
    { label: 'Concepts', value: modalData?.reference?.concepts?.join(', ') || '' },
  ]

  return (
    <Stack spacing={3}>
      <Stack spacing={2} sx={{ p: 2 }}>
        {fields.map(({ label, value }) => (
          <Box key={label}>
            <Typography variant='subtitle2' color='text.secondary'>
              {label}
            </Typography>
            <Typography variant='body1'>{value}</Typography>
          </Box>
        ))}
      </Stack>
      <Stack spacing={0} sx={{ textAlign: 'center' }}>
        <Typography variant='body1' color='cancel.main'>
          This action cannot be undone.
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          The reference will be permanently deleted
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          and removed from all associated concepts.
        </Typography>
      </Stack>
    </Stack>
  )
}

export default DeleteReferenceContent
