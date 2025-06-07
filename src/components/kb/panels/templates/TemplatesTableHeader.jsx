import { use } from 'react'
import { Box, Typography, Button } from '@mui/material'

import PanelTitle from '@/components/common/PanelTitle'

import TemplatesContext from '@/contexts/templates/TemplatesContext'
import useAddTemplateModal from './add/useAddTemplateModal'

const TemplatesHeader = () => {
  const { count, addTemplate } = use(TemplatesContext)
  const addTemplateModal = useAddTemplateModal(addTemplate)

  return (
    <Box>
      <PanelTitle title='Templates' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 1.25 }}>
        <Typography sx={{ ml: 2 }}>Total: {count}</Typography>
        <Button variant='contained' color='primary' onClick={addTemplateModal} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
    </Box>
  )
}

export default TemplatesHeader
