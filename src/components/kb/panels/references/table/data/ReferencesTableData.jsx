import { use, useState } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import ReferencesPagination from './ReferencesPagination'

import useEditReferenceButton from '@/components/kb/panels/references/table/data/useEditReferenceButton'
import useDeleteReferenceButton from '@/components/kb/panels/references/table/data/useDeleteReferenceButton'
import useReferenceColumns from '@/components/kb/panels/references/table/data/useReferenceColumns'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { PAGINATION, SELECTED } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.REFERENCES.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const { CONCEPT } = SELECTED
const { REFERENCES } = SELECTED.SETTINGS

const ReferencesTableData = () => {
  const { references } = use(ReferencesContext)
  const { getSelected, getSettings } = use(SelectedContext)

  const selectedConcept = getSelected(CONCEPT)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)

  const selectedReferences = byConcept
    ? references.filter(reference => reference.concepts.includes(selectedConcept))
    : references

  const editReferenceModal = useEditReferenceButton()
  const deleteReferenceModal = useDeleteReferenceButton()

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const columns = useReferenceColumns({ editReferenceModal, deleteReferenceModal })

  const nextPage = () => setOffset(prev => prev + limit)
  const prevPage = () => setOffset(prev => Math.max(0, prev - limit))
  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0)
  }

  const paginationComponent = (
    <ReferencesPagination
      count={selectedReferences.length}
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
      rows={selectedReferences}
      rowCount={selectedReferences.length}
      paginationModel={{
        page: Math.floor(offset / limit),
        pageSize: limit,
      }}
      pageSizeOptions={PAGINATION.REFERENCES.PAGE_SIZE_OPTIONS}
      paginationMode='server'
      paginationComponent={paginationComponent}
      dataGridProps={{
        disableColumnFilter: true,
        disableColumnMenu: true,
        getRowId: reference => reference.id,
      }}
    />
  )
}

export default ReferencesTableData
