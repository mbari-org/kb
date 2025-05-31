import { Box, IconButton } from '@mui/material'
import { CiEdit } from 'react-icons/ci'
import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai'

import { useTheme } from '@mui/material/styles'

import { USER_ROLES } from '@/lib/constants'

const useUserColumns = ({ lockUser, editUser }) => {
  const theme = useTheme()

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box>
          <IconButton
            size='small'
            onClick={() => lockUser(params.row)}
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
          <IconButton
            size='small'
            onClick={() => editUser(params.row)}
            sx={{
              '&:hover': {
                color: 'edit.main',
                ...theme.kb.icon.hover,
              },
            }}
          >
            <CiEdit size={24} />
          </IconButton>
        </Box>
      ),
    },
    { field: 'username', headerName: 'Username', width: 130, headerClassName: 'bold-header' },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      type: 'singleSelect',
      valueOptions: Object.values(USER_ROLES),
      headerClassName: 'bold-header',
    },
    { field: 'affiliation', headerName: 'Affiliation', width: 130, headerClassName: 'bold-header' },
    { field: 'firstName', headerName: 'First Name', width: 130, headerClassName: 'bold-header' },
    { field: 'lastName', headerName: 'Last Name', width: 130, headerClassName: 'bold-header' },
    { field: 'email', headerName: 'Email', width: 200, headerClassName: 'bold-header' },
  ]

  return columns
}

export default useUserColumns
