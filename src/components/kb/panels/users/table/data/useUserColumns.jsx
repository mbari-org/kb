import { Box } from '@mui/material'

import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'

import ActionIcon from '@/components/icon/ActionIcon'

import { USER_ROLES } from '@/lib/constants'
import { USERS } from '@/lib/constants'

const useUserColumns = ({ editUserModal, lockUserModal }) => {
  const lockToolTip = locked => locked ? USERS.UNLOCK : USERS.LOCK

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box>
          <ActionIcon
            Icon={params.row.locked ? AiOutlineLock : AiOutlineUnlock}
            onClick={() => lockUserModal(params.row)}
            tooltip={lockToolTip(params.row.locked)}
            color={params.row.locked ? 'add' : 'cancel'}
            size={22}
            sx={{ mr: 1 }}
          />

          <ActionIcon
            Icon={CiEdit}
            onClick={() => editUserModal(params.row)}
            tooltip={USERS.EDIT}
            color='edit'
            size={24}
            disabled={params.row.locked}
          />
        </Box>
      ),
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 130,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      type: 'singleSelect',
      valueOptions: Object.values(USER_ROLES),
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: 'affiliation',
      headerName: 'Affiliation',
      width: 130,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 130,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 130,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: 'locked',
      headerName: 'Locked',
      width: 100,
      headerClassName: 'bold-header',
      valueGetter: params => (params ? 'Yes' : 'No'),
    },
  ]

  return columns
}

export default useUserColumns
