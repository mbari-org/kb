import { use } from 'react'

import { Box, Typography, Stack } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'

const DeleteReferenceContent = () => {
  const { modalData } = use(ModalContext)
  const { reference } = modalData

  const fields = [
    { label: 'Citation', value: reference.citation },
    { label: 'DOI', value: reference.doi },
    { label: 'Concepts', value: reference.concepts?.join(', ') || '' },
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
