import { useContext, useState } from 'react'

import { Typography, Button, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import UsersContext from '@/contexts/users/UsersContext'

import useAddUser from './users/add/useAddUser'
import useDeleteUser from './users/delete/useDeleteUser'
import useEditUser from './users/edit/useEditUser'
import useExportUsers from './users/useExportUsers'
import useUserColumns from './users/useUserColumns'
import UsersPagination from './users/UsersPagination'

const DEFAULT_LIMIT = 5
const DEFAULT_OFFSET = 0

const Users = () => {
  const { users } = useContext(UsersContext)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const addUser = useAddUser()
  const deleteUser = useDeleteUser()
  const editUser = useEditUser()
  const { exportToCsv } = useExportUsers()
  const columns = useUserColumns({ deleteUser, editUser })

  const nextPage = () => {
    setOffset(prev => prev + limit)
  }

  const prevPage = () => {
    setOffset(prev => Math.max(0, prev - limit))
  }

  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0) // Reset to first page when changing page size
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography align='center' sx={{ mt: 3, mb: 1 }} variant='h4'>
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
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <DataGrid
          rows={users}
          columns={columns}
          paginationModel={{
            pageSize: limit,
            page: Math.floor(offset / limit),
          }}
          rowCount={users.length}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationMode='server'
          disableSelectionOnClick
          slots={{
            pagination: () => (
              <UsersPagination
                limit={limit}
                offset={offset}
                count={users.length}
                nextPage={nextPage}
                prevPage={prevPage}
                setPageSize={setPageSize}
              />
            ),
          }}
          sx={{
            height: '100%',
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
      </Box>
    </Box>
  )
}

export default Users
