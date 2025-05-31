import { useState } from 'react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import ReferencesPagination from './ReferencesPagination'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.REFERENCES.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const ReferencesTable = ({ references, onAddReference }) => {
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
        columns={[
          { field: 'citation', headerName: 'Citation', width: 400 },
          { field: 'doi', headerName: 'DOI', width: 200 },
        ]}
        disableColumnFilter
        disableColumnMenu
        disableSelectionOnClick
        getRowId={row => row.id}
        pageSizeOptions={PAGINATION.REFERENCES.PAGE_SIZE_OPTIONS}
        paginationMode='server'
        paginationModel={{
          pageSize: limit,
          page: Math.floor(offset / limit),
        }}
        rowCount={references.length}
        rows={references}
        slots={{
          pagination: () => (
            <ReferencesPagination
              count={references.length}
              limit={limit}
              nextPage={nextPage}
              offset={offset}
              prevPage={prevPage}
              setPageSize={setPageSize}
              onAddReference={onAddReference}
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
