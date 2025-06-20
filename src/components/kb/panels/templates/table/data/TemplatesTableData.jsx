import { use } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import TemplatesPagination from './TemplatesPagination'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useDeleteTemplateModal from '@/components/kb/panels/templates/form/delete/useDeleteTemplateModal'
import useEditTemplateModal from '@/components/kb/panels/templates/form/edit/useEditTemplateModal'
import useTemplateColumns from './useTemplateColumns'

import { PAGINATION } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS

const TemplatesTableData = () => {
  const {
    count,
    deleteTemplate,
    displayTemplates,
    editTemplate,
    limit,
    nextPage,
    offset,
    prevPage,
    setPageSize,
  } = use(TemplatesContext)

  const deleteTemplateModal = useDeleteTemplateModal(deleteTemplate)
  const editTemplateModal = useEditTemplateModal(editTemplate, displayTemplates)

  const columns = useTemplateColumns({ deleteTemplateModal, editTemplateModal })

  const paginationComponent = (
    <TemplatesPagination
      count={count}
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
      rows={displayTemplates}
      rowCount={count}
      paginationModel={{
        pageSize: limit,
        page: Math.floor(offset / limit),
      }}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationMode='server'
      paginationComponent={paginationComponent}
    />
  )
}

export default TemplatesTableData
