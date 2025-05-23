import { use, useEffect, useState } from 'react'

import { Typography, Button, Box, IconButton } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'
import { CiEdit } from 'react-icons/ci'
import { DataGrid } from '@mui/x-data-grid'

import ConfigContext from '@/contexts/config/ConfigContext'
import { fetchUsers, createUser, deleteUser as removeUser, updateUser } from '@/lib/kb/api/users'

import { ROLES } from '@/lib/constants'

import useAddUser from './users/add/useAddUser'
import useDeleteUser from './users/delete/useDeleteUser'
import useEditUser from './users/edit/useEditUser'

const Users = () => {
  const { apiFns } = use(ConfigContext)

  const [users, setUsers] = useState([])

  const handleAddUser = async newUser => {
    try {
      const createdUser = await apiFns.apiPayload(createUser, newUser)
      setUsers(prevUsers => [...prevUsers, { ...createdUser, id: prevUsers.length }])
    } catch (err) {
      console.error('Error adding user:', err)
    }
  }

  const handleDeleteUser = async userToDelete => {
    try {
      await apiFns.apiPayload(removeUser, userToDelete.id)
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id))
    } catch (err) {
      console.error('Error deleting user:', err)
    }
  }

  const handleEditUser = async editedUser => {
    try {
      const updatedUser = await apiFns.apiPayload(updateUser, [editedUser.id, editedUser])
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === updatedUser.id ? { ...updatedUser, id: user.id } : user))
      )
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await apiFns.apiPayload(fetchUsers)
        // Add id field required by DataGrid
        const usersWithIds = users.map((user, index) => ({ ...user, id: index }))
        setUsers(usersWithIds)
      } catch (err) {
        console.error('Error loading users:', err)
      }
    }

    loadUsers()
  }, [apiFns])

  const deleteUser = useDeleteUser(handleDeleteUser)
  const editUser = useEditUser(handleEditUser)

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

  const addUser = useAddUser(handleAddUser, users)

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
