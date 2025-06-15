import { use } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'

const DeleteTemplateContent = () => {
  const { modalData } = use(ModalContext)
  const { template } = modalData

  const fields = [
    { label: 'Concept', value: template.concept },
    { label: 'Link Name', value: template.linkName },
    { label: 'To Concept', value: template.toConcept },
    { label: 'Link Value', value: template.linkValue },
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
          The template will be permanently deleted.
        </Typography>
      </Stack>
    </Stack>
  )
}

export default DeleteTemplateContent
