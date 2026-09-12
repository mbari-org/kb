import { useCallback, useMemo, useState } from 'react'

import Pagination from '@/components/common/Pagination'
import PanelDataGrid from '@/components/common/panel/PanelDataGrid'

import useEditReferenceButton from '@/components/kb/panels/references/table/data/useEditReferenceButton'
import useDeleteReferenceButton from '@/components/kb/panels/references/table/data/useDeleteReferenceButton'
import useReferenceColumns from '@/components/kb/panels/references/table/data/useReferenceColumns'
import useFilteredReferences from '@/components/kb/panels/references/useFilteredReferences'

import { PAGINATION } from '@/lib/constants/pagination.js'

const DEFAULT_LIMIT = PAGINATION.REFERENCES.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const DATA_GRID_PROPS = {
  disableColumnFilter: true,
  disableColumnMenu: true,
  disableColumnSorting: true,
  getRowId: reference => reference.id,
}

const ReferencesTableData = () => {
  const { filteredReferences } = useFilteredReferences()

  const editReferenceModal = useEditReferenceButton()
  const deleteReferenceModal = useDeleteReferenceButton()

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const displayedReferences = useMemo(
    () => filteredReferences.slice(offset, offset + limit),
    [filteredReferences, limit, offset]
  )

  const columns = useReferenceColumns({ editReferenceModal, deleteReferenceModal })

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
        count={filteredReferences.length}
        limit={limit}
        offset={offset}
        onGoTo={goToPage}
        onNext={nextPage}
        onPageSizeChange={setPageSize}
        onPrev={prevPage}
        pageSizeOptions={PAGINATION.REFERENCES.PAGE_SIZE_OPTIONS}
      />
    ),
    [filteredReferences.length, goToPage, limit, nextPage, offset, prevPage, setPageSize]
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
      rows={displayedReferences}
      rowCount={filteredReferences.length}
      paginationModel={paginationModel}
      pageSizeOptions={PAGINATION.REFERENCES.PAGE_SIZE_OPTIONS}
      paginationMode='server'
      paginationComponent={paginationComponent}
      dataGridProps={DATA_GRID_PROPS}
    />
  )
}

export default ReferencesTableData
