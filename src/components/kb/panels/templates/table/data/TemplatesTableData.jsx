import { use, useEffect, useState } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import TemplatesPagination from './TemplatesPagination'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useEditTemplateButton from '@/components/kb/panels/templates/form/useEditTemplateButton'
import useDeleteTemplateButton from '@/components/kb/panels/templates/form/useDeleteTemplateButton'
import useTemplateColumns from './useTemplateColumns'

import { PAGINATION } from '@/lib/constants'

const { PAGE_SIZE_OPTIONS, DEFAULT_LIMIT } = PAGINATION.TEMPLATES

const TemplatesTableData = () => {
  const { filteredTemplates } = use(TemplatesContext)

  const [displayTemplates, setDisplayTemplates] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_LIMIT)

  const editTemplateModal = useEditTemplateButton()
  const deleteTemplateModal = useDeleteTemplateButton()

  const columns = useTemplateColumns({ deleteTemplateModal, editTemplateModal })

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
    setCurrentPage(1)
  }

  const paginationComponent = (
    <TemplatesPagination
      currentPage={currentPage}
      displayTemplates={filteredTemplates}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      pageSize={pageSize}
    />
  )

  return (
    <PanelDataGrid
      columns={columns}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationComponent={paginationComponent}
      paginationMode='client'
      paginationModel={{
        page: currentPage - 1, // MUI DataGrid uses 0-based indexing
        pageSize: pageSize,
      }}
      rowCount={filteredTemplates.length}
      rows={displayTemplates}
    />
  )
}

export default TemplatesTableData
