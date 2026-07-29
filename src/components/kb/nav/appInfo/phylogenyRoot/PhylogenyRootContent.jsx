import { use } from 'react'
import { Autocomplete, TextField } from '@mui/material'

import AppInfoEditLayout from '@/components/kb/nav/appInfo/AppInfoEditLayout'
import AppModalContext from '@/contexts/app/AppModalContext'
import CONFIG from '@/lib/config'

const phylogenyConfig = CONFIG.APP_INFO.PHYLOGENY_ROOT ?? CONFIG.APP_INFO.PHLOGENY_ROOT
const { DESCRIPTION, FIELD_LABEL } = phylogenyConfig

const PhylogenyRootContent = ({ conceptNames = [] }) => {
  const { modalData, setModalData } = use(AppModalContext)
  const alert = modalData.alert || null
  const selectedPhylogenyRoot = modalData.selectedPhylogenyRoot || ''

  return (
    <AppInfoEditLayout alert={alert} description={DESCRIPTION}>
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
        renderInput={params => <TextField {...params} helperText=' ' label={FIELD_LABEL} size='small' />}
        value={selectedPhylogenyRoot || null}
      />
    </AppInfoEditLayout>
  )
}

export default PhylogenyRootContent
