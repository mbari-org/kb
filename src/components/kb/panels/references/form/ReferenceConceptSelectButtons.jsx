import { Box, IconButton } from '@mui/material'
import { BiAddToQueue } from 'react-icons/bi'
import { MdOutlineDeleteForever } from 'react-icons/md'

const ReferenceConceptSelectButtons = ({
  handleAddConcept,
  handleDeleteConcept,
  isConceptSelected,
  selectedConcept,
}) => {
  return (
    <Box sx={{ pt: 1.5 }}>
      <Box sx={{ display: 'inline-block', mr: 1 }}>
        <IconButton
          size='small'
          onClick={handleDeleteConcept}
          disabled={!isConceptSelected}
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
          disabled={!selectedConcept || isConceptSelected}
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
  )
}

export default ReferenceConceptSelectButtons
