import { use } from 'react'

import { Box, TextField } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'

const EditReferenceContent = ({ isDoiUnique }) => {
  const { modalData, setModalData } = use(ModalContext)
  const { reference } = modalData

  const handleChange = field => event => {
    const newValue = event.target.value
    const updatedReference = {
      ...reference,
      [field]: newValue,
    }
    const modified =
      field === 'citation'
        ? newValue !== reference.originalReference.citation
        : field === 'doi'
        ? newValue !== reference.originalReference.doi
        : false

    setModalData({
      ...modalData,
      reference: updatedReference,
      modified,
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <TextField
        label='Citation'
        value={reference.citation || ''}
        onChange={handleChange('citation')}
        fullWidth
        required
        multiline
        minRows={3}
        maxRows={10}
      />
      <TextField
        label='DOI'
        value={reference.doi || ''}
        onChange={handleChange('doi')}
        fullWidth
        required
        error={!isDoiUnique(reference.doi, reference.id)}
        helperText={!isDoiUnique(reference.doi, reference.id) ? 'DOI already exists' : ''}
      />
    </Box>
  )
}

export default EditReferenceContent
