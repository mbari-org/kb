import { use, useCallback, useMemo, useState } from 'react'

import Pagination from '@/components/common/Pagination'
import PanelDataGrid from '@/components/common/panel/PanelDataGrid'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useEditUserButton from '@/components/kb/panels/users/form/useEditUserButton'
import useLockUserButton from '@/components/kb/panels/users/form/useLockUserButton'
import useUserColumns from '@/components/kb/panels/users/table/data/useUserColumns'

import { PAGINATION } from '@/lib/constants/pagination.js'

const DEFAULT_LIMIT = PAGINATION.USERS.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const DATA_GRID_PROPS = {
  disableColumnFilter: true,
  disableColumnMenu: true,
}

const USERS_SX = {
  '& .disabled-cell': {
    color: 'text.disabled',
    opacity: 0.85,
  },
}

const UsersTableData = () => {
  const { users } = use(UsersContext)

  const editUserModal = useEditUserButton()
  const lockUserModal = useLockUserButton()

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const columns = useUserColumns({ editUserModal, lockUserModal })

  const nextPage = useCallback(() => setOffset(prev => prev + limit), [limit])
  const prevPage = useCallback(() => setOffset(prev => Math.max(0, prev - limit)), [limit])
  const goToPage = useCallback(page => setOffset((page - 1) * limit), [limit])
  const setPageSize = useCallback(newLimit => {
    setLimit(newLimit)
    setOffset(0)
  }, [])

  const paginationComponent = useMemo(
    () => (
      <Pagination
        count={users.length}
        limit={limit}
        offset={offset}
        onGoTo={goToPage}
        onNext={nextPage}
        onPageSizeChange={setPageSize}
        onPrev={prevPage}
        pageSizeOptions={PAGINATION.USERS.PAGE_SIZE_OPTIONS}
      />
    ),
    [goToPage, limit, nextPage, offset, prevPage, setPageSize, users.length]
  )

  const paginationModel = useMemo(
    () => ({
      page: Math.floor(offset / limit),
      pageSize: limit,
    }),
    [limit, offset]
  )

  return (
    <PanelDataGrid
      columns={columns}
      dataGridProps={DATA_GRID_PROPS}
      paginationModel={paginationModel}
      pageSizeOptions={PAGINATION.USERS.PAGE_SIZE_OPTIONS}
      paginationComponent={paginationComponent}
      paginationMode='server'
      rows={users}
      rowCount={users.length}
      sx={USERS_SX}
    />
  )
}

export default UsersTableData
