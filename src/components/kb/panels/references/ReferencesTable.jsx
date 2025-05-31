import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import ReferencesPagination from './ReferencesPagination'

import useReferences from './useReferences'

import { PAGINATION } from '@/lib/constants'

const ReferencesTable = () => {
  const { references, limit, offset, setLimit, setOffset } = useReferences()

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
