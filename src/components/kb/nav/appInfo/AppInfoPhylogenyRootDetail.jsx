import { use } from 'react'
import { Autocomplete, Box, Button, Stack, TextField } from '@mui/material'

import AppInfoDetail from '@/components/kb/nav/appInfo/AppInfoDetail'
import AppModalContext from '@/contexts/app/AppModalContext'
import UserContext from '@/contexts/user/UserContext'

import Title from '@/components/common/factory/Title'
import createAppModal from '@/components/modal/app/createAppModal'
import { isAdmin } from '@/lib/auth/role'
import { PREFS } from '@/lib/constants/prefs.js'

const { PHYLOGENY } = PREFS.APP

const PhylogenyRootTitle = () => <Title title='Edit Phylogeny Root' />

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
const PhylogenyRootActions = () => {
  const { closeModal, modalData } = use(AppModalContext)
  const { saveAppPreference } = use(UserContext)
  const selectedPhylogenyRoot = modalData.selectedPhylogenyRoot || ''

  const handleCancel = () => closeModal(false)
  const handleSave = () => {
    if (!selectedPhylogenyRoot) return

    saveAppPreference(PHYLOGENY.KEY, selectedPhylogenyRoot)
      .then(() => closeModal(true))
      .catch(error => {
        console.warn('Saving phylogeny root preference failed:', error)
      })
  }

  return (
    <Stack direction='row' spacing={2}>
      <Button color='cancel' onClick={handleCancel} variant='contained'>
        Cancel
      </Button>
      <Button disabled={!selectedPhylogenyRoot} onClick={handleSave} variant='contained'>
        Save
      </Button>
    </Stack>
  )
}

const AppInfoPhylogenyRootDetail = ({ conceptNames = [] }) => {
  const { phylogenyRoot, user } = use(UserContext)
  const { closeModal, setModal, setModalData } = use(AppModalContext)

  const isAdminUser = isAdmin(user)

  const handleEditPhylogenyRoot = () => {
    const didClose = closeModal(true)
    if (!didClose) {
      return
    }
    setModalData({ selectedPhylogenyRoot: phylogenyRoot })

    const modal = createAppModal({
      Actions: PhylogenyRootActions,
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
      value={phylogenyRoot}
    />
  )
}

export default AppInfoPhylogenyRootDetail
