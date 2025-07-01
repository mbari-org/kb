import { use, useState } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import UsersPagination from './UsersPagination'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useEditUserButton from '@/components/kb/panels/users/form/useEditUserButton'
import useLockUserButton from '@/components/kb/panels/users/form/useLockUserButton'
import useUserColumns from '@/components/kb/panels/users/table/data/useUserColumns'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.USERS.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const UsersTableData = () => {
  const { users } = use(UsersContext)

  const editUserModal = useEditUserButton()
  const lockUserModal = useLockUserButton()

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const columns = useUserColumns({ editUserModal, lockUserModal })

  const nextPage = () => setOffset(prev => prev + limit)
  const prevPage = () => setOffset(prev => Math.max(0, prev - limit))
  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0)
  }

  const paginationComponent = (
    <UsersPagination
      count={users.length}
      limit={limit}
      nextPage={nextPage}
      offset={offset}
      prevPage={prevPage}
      setPageSize={setPageSize}
    />
  )

  return (
    <PanelDataGrid
      columns={columns}
      rows={users}
      rowCount={users.length}
      paginationModel={{
        pageSize: limit,
        page: Math.floor(offset / limit),
      }}
      pageSizeOptions={PAGINATION.USERS.PAGE_SIZE_OPTIONS}
      paginationMode='server'
      paginationComponent={paginationComponent}
      dataGridProps={{
        disableColumnFilter: true,
        disableColumnMenu: true,
        getRowId: undefined, // Use default row ID
      }}
      sx={{
        '& .disabled-cell': {
          color: 'text.disabled',
          opacity: 0.85,
        },
      }}
    />
  )
}

export default UsersTableData
