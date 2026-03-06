import { use, useState } from 'react'
import { Autocomplete, Box, TextField } from '@mui/material'

import AppInfoDetail from '@/components/kb/nav/appInfo/AppInfoDetail'
import AppModalContext from '@/contexts/app/AppModalContext'
import UserContext from '@/contexts/user/UserContext'

import Title from '@/components/common/factory/Title'
import createAppModal from '@/components/modal/app/createAppModal'
import { isAdmin } from '@/lib/auth/role'

const PhylogenyRootTitle = () => <Title title='Edit Phylogeny Root' />

const PhylogenyRootContent = ({ conceptNames = [] }) => {
  const [phylogenyRoot, setPhylogenyRoot] = useState('')

  return (
    <Box sx={{ minWidth: 500, p: 1 }}>
      <Autocomplete
        onChange={(_event, selectedName) => setPhylogenyRoot(selectedName || '')}
        options={conceptNames}
        renderInput={params => (
          <TextField
            {...params}
            label='Phylogeny Root'
            size='small'
          />
        )}
        value={phylogenyRoot || null}
      />
    </Box>
  )
}

const AppInfoPhylogenyRootDetail = ({ conceptNames = [] }) => {
  const { user } = use(UserContext)
  const { closeModal, setModal } = use(AppModalContext)

  const isAdminUser = isAdmin(user)

  const handleEditPhylogenyRoot = () => {
    const didClose = closeModal(true)
    if (!didClose) {
      return
    }

    const modal = createAppModal({
      Content: () => <PhylogenyRootContent conceptNames={conceptNames} />,
      Title: PhylogenyRootTitle,
      minWidth: 520,
      focusClose: true,
    })

    setModal(modal)
  }

  return (
    <AppInfoDetail
      editTooltip='Edit Phylogeny Root'
      label='Phylogeny Root'
      onEdit={isAdminUser ? handleEditPhylogenyRoot : undefined}
      value='marine organism'
    />
  )
}

export default AppInfoPhylogenyRootDetail
