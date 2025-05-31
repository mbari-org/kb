import { use } from 'react'

import { Box, TextField } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'
import ReferencesContext from '@/contexts/references/ReferencesContext'

const AddReferenceContent = () => {
  const { modalData, setModalData } = use(ModalContext)
  const { references } = use(ReferencesContext)

  const { reference } = modalData

  const isDoiUnique = doi => {
    if (!doi) return true
    return !references.some(ref => ref.doi === doi)
  }

  const handleChange = field => event => {
    const newValue = event.target.value
    const updatedReference = {
      ...reference,
      [field]: newValue,
    }
    setModalData({
      ...modalData,
      reference: updatedReference,
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
      />
      <TextField
        label='DOI'
        value={reference.doi || ''}
        onChange={handleChange('doi')}
        fullWidth
        required
        error={!isDoiUnique(reference.doi)}
        helperText={!isDoiUnique(reference.doi) ? 'DOI already exists' : ''}
      />
    </Box>
  )
}

export default AddReferenceContent
