import { use } from 'react'
import { Autocomplete, Box, TextField } from '@mui/material'

import AppModalContext from '@/contexts/app/AppModalContext'

const PhylogenyRootContent = ({ conceptNames = [] }) => {
  const { modalData, setModalData } = use(AppModalContext)
  const selectedPhylogenyRoot = modalData.selectedPhylogenyRoot || ''

  return (
    <Box sx={{ minWidth: 500, p: 1 }}>
      <Autocomplete
        onChange={(_event, selectedName) =>
          setModalData(prev => ({ ...prev, selectedPhylogenyRoot: selectedName || '' }))
        }
        options={conceptNames}
        renderInput={params => <TextField {...params} label='Phylogeny Root' size='small' />}
        value={selectedPhylogenyRoot || null}
      />
    </Box>
  )
}

export default PhylogenyRootContent
