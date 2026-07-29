import { use } from 'react'
import { Autocomplete, TextField } from '@mui/material'

import AppInfoEditLayout from '@/components/kb/nav/appInfo/AppInfoEditLayout'
import AppModalContext from '@/contexts/app/AppModalContext'
import CONFIG from '@/lib/config'

const phylogenyDescription =
  CONFIG.APP_INFO.DESCRIPTION['PHYLOGENY ROOT'] ?? CONFIG.APP_INFO.DESCRIPTION['PHLOGENY ROOT'] ?? ''

const PhylogenyRootContent = ({ conceptNames = [] }) => {
  const { modalData, setModalData } = use(AppModalContext)
  const alert = modalData.alert || null
  const selectedPhylogenyRoot = modalData.selectedPhylogenyRoot || ''

  return (
    <AppInfoEditLayout alert={alert} description={phylogenyDescription}>
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
        renderInput={params => <TextField {...params} helperText=' ' label='Phylogeny Root' size='small' />}
        value={selectedPhylogenyRoot || null}
      />
    </AppInfoEditLayout>
  )
}

export default PhylogenyRootContent
