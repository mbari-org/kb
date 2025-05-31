import { Box, Button, Typography } from '@mui/material'

import PanelTitle from '@/components/common/PanelTitle'

import useAddReference from './add/useAddReference'
import useReferences from './useReferences'

const ReferencesHeader = () => {
  const { references } = useReferences()
  const addReference = useAddReference()

  return (
    <Box>
      <PanelTitle title='References' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Typography variant='body1' sx={{ ml: 2 }}>
          Total: {references?.length || 0}
        </Typography>
        <Button variant='contained' color='primary' onClick={addReference} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
    </Box>
  )
}

export default ReferencesHeader
