import { use, useState } from 'react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import UsersPagination from './UsersPagination'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useEditUserModal from '@/components/kb/panels/users/form/edit/useEditUserModal'
import useLockUserModal from '@/components/kb/panels/users/form/lock/useLockUserModal'
import useUserColumns from '@/components/kb/panels/users/table/data/useUserColumns'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.USERS.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const UsersTableData = () => {
  const { editUser, lockUser, users } = use(UsersContext)

  const editUserModal = useEditUserModal(editUser)
  const lockUserModal = useLockUserModal(lockUser, users)

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const columns = useUserColumns({ editUserModal, lockUserModal, users })

  const nextPage = () => setOffset(prev => prev + limit)
  const prevPage = () => setOffset(prev => Math.max(0, prev - limit))
  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0)
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
      <DataGrid
        columns={columns}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        disableSelectionOnClick
        getRowHeight={() => 'auto'}
        pageSizeOptions={PAGINATION.USERS.PAGE_SIZE_OPTIONS}
        paginationMode='server'
        paginationModel={{
          pageSize: limit,
          page: Math.floor(offset / limit),
        }}
        rowCount={users.length}
        rows={users}
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
          '& .disabled-cell': {
            color: 'text.disabled',
            opacity: 0.85,
          },
        }}
      />
    </Box>
  )
}

export default UsersTableData
