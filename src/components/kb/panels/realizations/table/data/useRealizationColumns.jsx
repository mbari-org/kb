import { use } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import TemplateCell from '@/components/kb/panels/templates/table/data/TemplateCell'

import { humanTimestamp } from '@/lib/utils'
import { SELECTED } from '@/lib/constants/selected.js'

const { REALIZATIONS } = SELECTED.SETTINGS

const useRealizationColumns = () => {
  const { updateFilters } = use(RealizationsContext)
  const { updateSelected } = use(SelectedContext)

  return [
    {
      field: 'concept',
      headerClassName: 'bold-header',
      headerName: 'Concept',
      renderCell: TemplateCell({
        filterKey: REALIZATIONS.FILTERS.CONCEPT,
        updateFilters,
        onConceptClick: conceptName => updateSelected({ [SELECTED.CONCEPT]: conceptName }),
      }),
      width: 175,
    },
    {
      field: 'linkName',
      headerClassName: 'bold-header',
      headerName: 'Link Name',
      renderCell: TemplateCell({ filterKey: REALIZATIONS.FILTERS.LINK_NAME, updateFilters }),
      width: 175,
    },
    {
      field: 'toConcept',
      headerClassName: 'bold-header',
      headerName: 'To Concept',
      renderCell: TemplateCell({ filterKey: REALIZATIONS.FILTERS.TO_CONCEPT, updateFilters }),
      width: 175,
    },
    {
      field: 'linkValue',
      headerClassName: 'bold-header',
      headerName: 'Link Value',
      renderCell: TemplateCell({ filterKey: REALIZATIONS.FILTERS.LINK_VALUE, updateFilters }),
      width: 250,
    },
    {
      field: 'lastUpdated',
      headerClassName: 'bold-header',
      headerName: 'Last Updated',
      valueFormatter: value => humanTimestamp(value),
      width: 165,
    },
  ]
}

export default useRealizationColumns
