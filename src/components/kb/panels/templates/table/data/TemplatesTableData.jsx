import { use } from 'react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import useTemplateColumns from './useTemplateColumns'
import TemplatesPagination from './TemplatesPagination'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useDeleteTemplateModal from '@/components/kb/panels/templates/form/delete/useDeleteTemplateModal'
import useEditTemplateModal from '@/components/kb/panels/templates/form/edit/useEditTemplateModal'

import { PAGINATION } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS

const TemplatesTableData = () => {
  const {
    count,
    deleteTemplate,
    editTemplate,
    limit,
    nextPage,
    offset,
    prevPage,
    setPageSize,
    templates,
  } = use(TemplatesContext)

  const deleteTemplateModal = useDeleteTemplateModal(deleteTemplate)
  const editTemplateModal = useEditTemplateModal(editTemplate, templates)

  const columns = useTemplateColumns({ deleteTemplateModal, editTemplateModal })

  return (
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
      <DataGrid
        columns={columns}
        disableRowSelectionOnClick
        disableSelectionOnClick
        getRowHeight={() => 'auto'}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        paginationMode='server'
        paginationModel={{
          pageSize: limit,
          page: Math.floor(offset / limit),
        }}
        rowCount={count}
        rows={templates}
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
