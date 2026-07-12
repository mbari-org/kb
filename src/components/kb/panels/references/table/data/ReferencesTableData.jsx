import { use, useEffect, useState } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import ReferencesPagination from './ReferencesPagination'

import useEditReferenceButton from '@/components/kb/panels/references/table/data/useEditReferenceButton'
import useDeleteReferenceButton from '@/components/kb/panels/references/table/data/useDeleteReferenceButton'
import useReferenceColumns from '@/components/kb/panels/references/table/data/useReferenceColumns'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import { CONCEPT } from '@/lib/constants'

import { SELECTED } from '@/lib/constants/selected.js'
import { PAGINATION } from '@/lib/constants/pagination.js'
import { getDescendantNames } from '@/lib/model/concept'

const DEFAULT_LIMIT = PAGINATION.REFERENCES.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const { CONCEPT: SELECTED_CONCEPT } = SELECTED
const { REFERENCES } = SELECTED.SETTINGS
const { EXTENT } = CONCEPT

const ReferencesTableData = () => {
  const { getReferences } = use(PanelDataContext)
  const { apiFns } = use(ConfigContext)
  const { citationGlob, conceptExtent } = use(ReferencesContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const { getConcept } = use(TaxonomyContext)

  const [descendantExtent, setDescendantExtent] = useState({ conceptName: null, names: [] })

  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const selectedConcept = byConcept ? getSelected(SELECTED_CONCEPT) : null

  useEffect(() => {
    if (!selectedConcept || conceptExtent !== EXTENT.DESCENDANTS) return

    let cancelled = false
    const loadDescendants = async () => {
      const descendantNames = await getDescendantNames(apiFns, selectedConcept)
      if (!cancelled) {
        setDescendantExtent({ conceptName: selectedConcept, names: descendantNames })
      }
    }

    loadDescendants().catch(() => {
      if (!cancelled) {
        setDescendantExtent({ conceptName: selectedConcept, names: [] })
      }
    })

    return () => {
      cancelled = true
    }
  }, [apiFns, conceptExtent, getConcept, selectedConcept])

  const allReferences = getReferences(null)
  let selectedConceptReferences
  switch (conceptExtent) {
    case EXTENT.CHILDREN:
    case EXTENT.DESCENDANTS: {
      if (!selectedConcept) {
        selectedConceptReferences = allReferences
        break
      }
      let extentConceptNames = [selectedConcept]
      if (conceptExtent === EXTENT.CHILDREN) {
        const selectedTaxonomyConcept = getConcept(selectedConcept)
        extentConceptNames = [selectedConcept, ...(selectedTaxonomyConcept?.children || [])]
      } else if (descendantExtent.conceptName === selectedConcept) {
        extentConceptNames = [selectedConcept, ...descendantExtent.names]
      }

      const conceptNameSet = new Set(extentConceptNames)
      selectedConceptReferences = allReferences.filter(reference =>
        reference.concepts?.some(referenceConcept => conceptNameSet.has(referenceConcept))
      )
      break
    }
    default:
      selectedConceptReferences = getReferences(selectedConcept)
  }
  const filteredReferences = selectedConceptReferences.filter(reference =>
    reference.citation.toLowerCase().includes(citationGlob.toLowerCase())
  )

  const editReferenceModal = useEditReferenceButton()
  const deleteReferenceModal = useDeleteReferenceButton()

  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const displayedReferences = filteredReferences.slice(offset, offset + limit)

  const columns = useReferenceColumns({ editReferenceModal, deleteReferenceModal })

  const nextPage = () => setOffset(prev => prev + limit)
  const prevPage = () => setOffset(prev => Math.max(0, prev - limit))
  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0)
  }

  const paginationComponent = (
    <ReferencesPagination
      count={filteredReferences.length}
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
      rows={displayedReferences}
      rowCount={filteredReferences.length}
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
        disableColumnSorting: true,
        getRowId: reference => reference.id,
      }}
    />
  )
}

export default ReferencesTableData
