import { use } from 'react'
import { Box, Button, Typography } from '@mui/material'

import PanelTitle from '@/components/common/PanelTitle'

import useAddReferenceModal from '@/components/kb/panels/references/add/useAddReference'

import ReferencesContext from '@/contexts/references/ReferencesContext'

const ReferencesHeader = () => {
  const { addReference, references } = use(ReferencesContext)

  const addReferenceModal = useAddReferenceModal(addReference, references)

  return (
    <Box>
      <PanelTitle title='References' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Typography variant='body1' sx={{ ml: 2 }}>
          Total: {references?.length || 0}
        </Typography>
        <Button variant='contained' color='primary' onClick={addReferenceModal} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
    </Box>
  )
}

export default ReferencesHeader
