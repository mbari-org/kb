import { Box, IconButton } from '@mui/material'
import { CiEdit } from 'react-icons/ci'
import { IoCloseSharp } from 'react-icons/io5'

import { ROLES } from '@/lib/constants'

const useUserColumns = ({ deleteUser, editUser }) => {
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
            onClick={() => deleteUser(params.row)}
            sx={{
              mr: 1,
              '&:hover': {
                color: 'error.main',
                transform: 'scale(1.2)',
                transition: 'transform 0.2s',
              },
            }}
          >
            <IoCloseSharp size={24} />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => editUser(params.row)}
            sx={{
              '&:hover': {
                color: 'edit.main',
                transform: 'scale(1.2)',
                transition: 'transform 0.2s',
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
      valueOptions: Object.values(ROLES),
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
