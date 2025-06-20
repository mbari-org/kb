import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'

import KBTooltip from '@/components/common/KBTooltip'

import { USER_ROLES } from '@/lib/constants'
import { USERS } from '@/lib/tooltips'

const useUserColumns = ({ editUserModal, lockUserModal }) => {
  const theme = useTheme()

  const lockToolTip = role => {
    if (role === USER_ROLES.READ_ONLY) {
      return USERS.UNLOCK
    }
    return USERS.LOCK
  }

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box>
          <KBTooltip title={lockToolTip(params.row.role)}>
            <IconButton
              size='small'
              onClick={() => lockUserModal(params.row)}
              sx={{
                mr: 1,
                '&:hover': {
                  color: 'error.main',
                  ...theme.kb.icon.hover,
                },
              }}
            >
              {params.row.locked ? <AiOutlineLock size={22} /> : <AiOutlineUnlock size={22} />}
            </IconButton>
          </KBTooltip>

          <KBTooltip title={USERS.EDIT}>
            <IconButton
              size='small'
              onClick={() => editUserModal(params.row)}
              disabled={params.row.locked}
              sx={{
                '&:hover': {
                  color: 'edit.main',
                  ...theme.kb.icon.hover,
                },
              }}
            >
              <CiEdit size={24} />
            </IconButton>
          </KBTooltip>
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
