import { use } from 'react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import TemplatesContext from '@/contexts/templates/TemplatesContext'
import useTemplateColumns from './useTemplateColumns'
import TemplatesPagination from './TemplatesPagination'

import { PAGINATION } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS

const TemplatesTableData = () => {
  const { templates, count, limit, offset, nextPage, prevPage, setPageSize } = use(TemplatesContext)
  const columns = useTemplateColumns()

  return (
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
      <DataGrid
        columns={columns}
        disableRowSelectionOnClick
        disableSelectionOnClick
        rows={templates}
        rowCount={count}
        paginationMode='server'
        paginationModel={{
          pageSize: limit,
          page: Math.floor(offset / limit),
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        slots={{
          pagination: () => (
            <TemplatesPagination
              count={count}
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

export default TemplatesTableData
