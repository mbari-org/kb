import { useContext } from 'react'

import { Typography, Button, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import UsersContext from '@/contexts/users/UsersContext'

import useAddUser from './users/add/useAddUser'
import useDeleteUser from './users/delete/useDeleteUser'
import useEditUser from './users/edit/useEditUser'
import useExportUsers from './users/useExportUsers'
import useUserColumns from './users/useUserColumns'

const Users = () => {
  const { users } = useContext(UsersContext)

  const addUser = useAddUser()
  const deleteUser = useDeleteUser()
  const editUser = useEditUser()
  const { exportToCsv } = useExportUsers()
  const columns = useUserColumns({ deleteUser, editUser })

  return (
    <>
      <Typography align='center' sx={{ mt: 3, mb: 1 }} variant='h3'>
        Users
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Button variant='contained' color='primary' onClick={addUser} sx={{ ml: 2 }}>
          Add User
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => exportToCsv(users)}
          sx={{ mr: 2 }}
        >
          Export CSV
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
