import { use, useEffect, useState } from 'react'

import { Typography, Button, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import { fetchUsers } from '@/lib/kb/api/users'

import { ROLES } from '@/lib/constants'

import useAddUser from './users/add/useAddUser'

const Users = () => {
  const { apiFns } = use(ConfigContext)
  const { setModal } = use(ModalContext)

  const [users, setUsers] = useState([])

  const handleCellEditCommit = params => {
    const { id, field, value } = params
    setUsers(prevUsers =>
      prevUsers.map(user => (user.id === id ? { ...user, [field]: value } : user))
    )
    // TODO: Implement actual API call to save changes
    console.log('Cell edit:', { id, field, value })
  }

  const handleAddUser = newUser => {
    setUsers(prevUsers => [...prevUsers, { ...newUser, id: prevUsers.length }])
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

  const columns = [
    { field: 'username', headerName: 'Username', width: 130, editable: false },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: Object.values(ROLES),
    },
    { field: 'affiliation', headerName: 'Affiliation', width: 130, editable: true },
    { field: 'firstName', headerName: 'First Name', width: 130, editable: true },
    { field: 'lastName', headerName: 'Last Name', width: 130, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
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
          onCellEditCommit={handleCellEditCommit}
          editMode='cell'
        />
      </div>
    </>
  )
}

export default Users
