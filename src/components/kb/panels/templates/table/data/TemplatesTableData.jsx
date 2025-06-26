import { use, useEffect, useState } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import TemplatesPagination from './TemplatesPagination'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useDeleteTemplateModal from '@/components/kb/panels/templates/form/delete/useDeleteTemplateModal'
import useEditTemplateModal from '@/components/kb/panels/templates/form/edit/useEditTemplateModal'
import useTemplateColumns from './useTemplateColumns'

import { PAGINATION } from '@/lib/constants'

const { PAGE_SIZE_OPTIONS } = PAGINATION.TEMPLATES

const TemplatesTableData = () => {
  const { deleteTemplate, editTemplate, filteredTemplates } = use(TemplatesContext)

  const [displayTemplates, setDisplayTemplates] = useState([])

  // Local pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])

  const deleteTemplateModal = useDeleteTemplateModal(deleteTemplate)
  const editTemplateModal = useEditTemplateModal(editTemplate, displayTemplates)

  const columns = useTemplateColumns({ deleteTemplateModal, editTemplateModal })

  // Paginate the filtered templates
  useEffect(() => {
    if (!filteredTemplates || filteredTemplates.length === 0) {
      setDisplayTemplates([])
      return
    }

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = filteredTemplates.slice(startIndex, endIndex)
    setDisplayTemplates(paginated)
  }, [filteredTemplates, currentPage, pageSize])

  const handlePageChange = newPage => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  const paginationComponent = (
    <TemplatesPagination
      displayTemplates={filteredTemplates}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  )

  return (
    <PanelDataGrid
      columns={columns}
      rows={displayTemplates}
      rowCount={filteredTemplates.length}
      paginationModel={{
        pageSize: pageSize,
        page: currentPage - 1, // MUI DataGrid uses 0-based indexing
      }}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationMode='client'
      paginationComponent={paginationComponent}
    />
  )
}

export default TemplatesTableData
