import { Box, TextField, IconButton, Stack } from '@mui/material'
import { BiAddToQueue } from 'react-icons/bi'
import { MdOutlineDeleteForever } from 'react-icons/md'

import ConceptSearch from '@/components/common/ConceptSearch'

import useReferenceForm from '@/hooks/useReferenceForm'

const ReferenceForm = ({ isDoiUnique, isEdit = false, onChange, reference }) => {
  const {
    handleAddConcept,
    handleChange,
    handleConceptSelect,
    handleDeleteConcept,
    handleKeyUp,
    handleSearchInput,
    selectedConcept,
  } = useReferenceForm({ isEdit, onChange, reference })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <TextField
        error={!isDoiUnique(reference.doi, reference.id)}
        fullWidth
        helperText={!isDoiUnique(reference.doi, reference.id) ? 'DOI already exists' : ''}
        label='DOI'
        onChange={handleChange('doi')}
        required
        value={reference.doi || ''}
      />
      <TextField
        fullWidth
        label='Citation'
        maxRows={10}
        minRows={3}
        multiline
        onChange={handleChange('citation')}
        required
        value={reference.citation || ''}
      />
      <TextField
        fullWidth
        label='Concepts'
        onChange={handleChange('concepts')}
        placeholder='Enter concept names using the search box below'
        value={reference.concepts?.join(', ') || ''}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <Stack alignItems='center' direction='row' justifyContent='center' spacing={1}>
        <Box sx={{ pt: 1.5 }}>
          <Box sx={{ display: 'inline-block', mr: 1 }}>
            <IconButton
              size='small'
              onClick={handleDeleteConcept}
              disabled={!selectedConcept}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  transform: 'scale(1.25)',
                  color: 'cancel.main',
                },
              }}
            >
              <MdOutlineDeleteForever />
            </IconButton>
          </Box>
          <Box sx={{ display: 'inline-block' }}>
            <IconButton
              size='small'
              onClick={handleAddConcept}
              disabled={!selectedConcept}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  transform: 'scale(1.25)',
                  color: 'edit.main',
                },
              }}
            >
              <BiAddToQueue />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ width: 8 }} />
        <Box sx={{ width: '50%' }}>
          <ConceptSearch
            conceptName={selectedConcept}
            handleConceptSelect={handleConceptSelect}
            handleKeyUp={handleKeyUp}
            onInputChange={handleSearchInput}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default ReferenceForm
