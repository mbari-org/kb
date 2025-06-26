import { use, useEffect, useState } from 'react'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import TemplatesPagination from './TemplatesPagination'

import KBDataContext from '@/contexts/kbData/KBDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useDeleteTemplateModal from '@/components/kb/panels/templates/form/delete/useDeleteTemplateModal'
import useEditTemplateModal from '@/components/kb/panels/templates/form/edit/useEditTemplateModal'
import useTemplateColumns from './useTemplateColumns'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { PAGINATION, SELECTED } from '@/lib/constants'

const { PAGE_SIZE_OPTIONS } = PAGINATION.TEMPLATES
const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesTableData = () => {
  const { templates } = use(KBDataContext)
  const { getSettings } = use(SelectedContext)
  const { getAncestors } = use(TaxonomyContext)
  const { count, deleteTemplate, editTemplate, limit, nextPage, offset, prevPage, setPageSize } =
    use(TemplatesContext)

  const templatesSettings = getSettings(TEMPLATES.KEY)
  const { available, concept, toConcept } = templatesSettings

  const [displayTemplates, setDisplayTemplates] = useState([])

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

  useEffect(() => {
    const concepts = concept
      ? available
        ? [concept, ...(getAncestors(concept) || [])]
        : [concept]
      : null

    setDisplayTemplates(filterTemplates(templates, concepts, toConcept))
  }, [available, concept, getAncestors, templates, toConcept])

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
