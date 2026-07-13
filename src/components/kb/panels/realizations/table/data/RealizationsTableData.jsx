import { use, useEffect, useMemo, useRef } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'

import createConceptRealizationModal from '@/components/kb/panels/concepts/concept/detail/realizations/createConceptRealizationModal'
import useRealizationColumns from '@/components/kb/panels/realizations/table/data/useRealizationColumns'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { SELECTED } from '@/lib/constants/selected.js'

const RealizationsTableData = () => {
  const { setConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)
  const { getSelected } = use(SelectedContext)
  const { isConceptLoaded, loadConcept } = use(TaxonomyContext)
  const isLoadingRef = useRef(false)

  const selectedConcept = getSelected(SELECTED.CONCEPT)

  useEffect(() => {
    if (!selectedConcept || isConceptLoaded(selectedConcept) || isLoadingRef.current) return

    let cancelled = false
    isLoadingRef.current = true

    loadConcept(selectedConcept)
      .then(loadedConcept => {
        if (!cancelled && loadedConcept) {
          setConcept(loadedConcept)
        }
      })
      .finally(() => {
        if (!cancelled) {
          isLoadingRef.current = false
        }
      })

    return () => {
      cancelled = true
      isLoadingRef.current = false
    }
  }, [isConceptLoaded, loadConcept, selectedConcept, setConcept])

  const onViewRealization = realization => {
    const modal = createConceptRealizationModal(realization)
    setModalData({ realization })
    setModal(modal)
  }

  const columns = useRealizationColumns({ onViewRealization })

  const rowsWithId = useMemo(() => {
    const rows = stagedState?.realizations || []
    return rows.map((row, index) => ({ ...row, __rowId: `${row.linkName || 'realization'}-${index}` }))
  }, [stagedState?.realizations])

  return (
    <PanelDataGrid
      columns={columns}
      dataGridProps={{
        disableColumnFilter: true,
        disableColumnMenu: true,
        disableColumnSorting: true,
        getRowId: row => row.__rowId,
      }}
      hideFooter={true}
      paginationMode='client'
      paginationModel={{ page: 0, pageSize: rowsWithId.length || 1 }}
      rows={rowsWithId}
      rowCount={rowsWithId.length}
      sx={{ minHeight: 0 }}
    />
  )
}

export default RealizationsTableData
