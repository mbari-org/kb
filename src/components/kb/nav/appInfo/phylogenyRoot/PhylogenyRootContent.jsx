import { use } from 'react'
import { Autocomplete, Box, TextField } from '@mui/material'
import ActionsAlert from '@/components/modal/actions/ActionsAlert'

import AppModalContext from '@/contexts/app/AppModalContext'

const PhylogenyRootContent = ({ conceptNames = [] }) => {
  const { modalData, setModalData } = use(AppModalContext)
  const alert = modalData.alert || null
  const selectedPhylogenyRoot = modalData.selectedPhylogenyRoot || ''

  return (
    <Box sx={{ minWidth: 500, p: 1 }}>
      <Autocomplete
        onChange={(_event, selectedName) =>
          setModalData(prev => ({
            ...prev,
            alert: null,
            confirmCommit: false,
            selectedPhylogenyRoot: selectedName || '',
          }))
        }
        options={conceptNames}
        renderInput={params => <TextField {...params} label='Phylogeny Root' size='small' />}
        value={selectedPhylogenyRoot || null}
      />
      <Box sx={{ alignItems: 'center', display: 'flex', height: 60, justifyContent: 'center', mt: 1 }}>
        {alert ? <ActionsAlert lines={alert.lines} severity={alert.severity || 'info'} /> : null}
      </Box>
    </Box>
  )
}

export default PhylogenyRootContent
