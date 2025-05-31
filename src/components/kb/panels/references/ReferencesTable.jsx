import { useState } from 'react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import ReferencesPagination from './ReferencesPagination'

const DEFAULT_LIMIT = 25
const DEFAULT_OFFSET = 0

const ReferencesTable = () => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const nextPage = () => setOffset(prev => prev + limit)
  const prevPage = () => setOffset(prev => Math.max(0, prev - limit))
  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0)
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
      <DataGrid
        rows={[]}
        columns={[]}
        paginationModel={{
          pageSize: limit,
          page: Math.floor(offset / limit),
        }}
        rowCount={0}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationMode='server'
        disableSelectionOnClick
        disableColumnMenu
        disableColumnFilter
        slots={{
          pagination: () => (
            <ReferencesPagination
              count={0}
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

export default ReferencesTable
