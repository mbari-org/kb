import { useState } from 'react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import UsersPagination from './UsersPagination'
import useDeleteUser from './delete/useDeleteUser'
import useEditUser from './edit/useEditUser'
import useUserColumns from './useUserColumns'

const DEFAULT_LIMIT = 25
const DEFAULT_OFFSET = 0

const UsersTable = ({ users }) => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const deleteUser = useDeleteUser()
  const editUser = useEditUser()
  const columns = useUserColumns({ deleteUser, editUser })

  const nextPage = () => setOffset(prev => prev + limit)

  const prevPage = () => setOffset(prev => Math.max(0, prev - limit))

  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0) // Reset to first page when changing page size
  }

  return (
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
              count={users.length}
              limit={limit}
              nextPage={nextPage}
              offset={offset}
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
  )
}

export default UsersTable
