import { useContext } from 'react'

import { Typography, Button, Box, IconButton } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'
import { CiEdit } from 'react-icons/ci'
import { DataGrid } from '@mui/x-data-grid'

import UsersContext from '@/contexts/users/UsersContext'

import { ROLES } from '@/lib/constants'

import useAddUser from './users/add/useAddUser'
import useDeleteUser from './users/delete/useDeleteUser'
import useEditUser from './users/edit/useEditUser'

const Users = () => {
  const { users } = useContext(UsersContext)

  const addUser = useAddUser()
  const deleteUser = useDeleteUser()
  const editUser = useEditUser()

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

  return (
    <>
      <Typography align='center' sx={{ mt: 3, mb: 1 }} variant='h3'>
        Users
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mt: -2 }}>
        <Button variant='contained' color='primary' onClick={addUser} sx={{ mr: 2.5 }}>
          Add User
        </Button>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'background.paper',
              '& .MuiDataGrid-columnHeader': {
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                  fontSize: '1rem',
                },
              },
            },
          }}
        />
      </div>
    </>
  )
}

export default Users
