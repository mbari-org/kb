import { use, useEffect, useState } from 'react'

import { Typography, Button, Box, IconButton } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'
import { DataGrid } from '@mui/x-data-grid'

import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import { fetchUsers } from '@/lib/kb/api/users'

import { ROLES } from '@/lib/constants'

import useAddUser from './users/add/useAddUser'
import useDeleteUser from './users/delete/useDeleteUser'

const Users = () => {
  const { apiFns } = use(ConfigContext)
  const { setModal } = use(ModalContext)

  const [users, setUsers] = useState([])

  const handleAddUser = newUser => {
    setUsers(prevUsers => [...prevUsers, { ...newUser, id: prevUsers.length }])
  }

  const handleDeleteUser = userToDelete => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id))
  }

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await apiFns.apiPayload(fetchUsers)
        // Add id field required by DataGrid
        const usersWithIds = users.map((user, index) => ({ ...user, id: index }))
        setUsers(usersWithIds)
      } catch (err) {
        console.error(err)
      }
    }

    loadUsers()
  }, [apiFns])

  const deleteUser = useDeleteUser(handleDeleteUser)

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: params => (
        <IconButton
          size='small'
          onClick={() => deleteUser(params.row)}
          sx={{
            ml: 1,
            '&:hover': {
              color: 'error.main',
            },
          }}
        >
          <IoCloseSharp size={20} />
        </IconButton>
      ),
    },
    { field: 'username', headerName: 'Username', width: 130 },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      type: 'singleSelect',
      valueOptions: Object.values(ROLES),
    },
    { field: 'affiliation', headerName: 'Affiliation', width: 130 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
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
        />
      </div>
    </>
  )
}

export default Users
