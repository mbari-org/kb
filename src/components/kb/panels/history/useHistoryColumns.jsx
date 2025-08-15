import { use } from 'react'

import { Box } from '@mui/material'

import InspectIcon from '@/components/common/icon/InspectIcon'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { humanTimestamp } from '@/lib/utils'

import { SELECTED } from '@/lib/constants'

const useHistoryColumns = ({ type }) => {
  const { updateSelected } = use(SelectedContext)

  const handleConceptInspect = row => {
    updateSelected({ [SELECTED.CONCEPT]: row.concept, [SELECTED.PANEL]: SELECTED.PANELS.CONCEPTS })
  }

  // Determine if columns should be sortable based on history type
  const isSortable = type === 'concept'

  const baseColumns = [
    {
      field: 'inspect',
      headerName: '',
      width: 50,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box>
          {(type === 'pending' || (type === 'concept' && !params.row.approved)) && (
            <InspectIcon
              onClick={() => handleConceptInspect(params.row)}
              tooltip='View this Concept'
            />
          )}
        </Box>
      ),
    },
    {
      field: 'field',
      headerName: 'Field',
      width: 130,
      headerClassName: 'bold-header',
      sortable: isSortable,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      headerClassName: 'bold-header',
      sortable: isSortable,
    },
    {
      field: 'creatorName',
      headerName: 'Creator',
      width: 130,
      headerClassName: 'bold-header',
      sortable: isSortable,
    },
    {
      field: 'creationTimestamp',
      headerName: 'Created',
      width: 165,
      headerClassName: 'bold-header',
      sortable: isSortable,
      valueFormatter: params => humanTimestamp(params),
    },
    {
      field: 'oldValue',
      headerName: 'Old Value',
      width: 200,
      headerClassName: 'bold-header',
      sortable: isSortable,
    },
    {
      field: 'newValue',
      headerName: 'New Value',
      width: 200,
      headerClassName: 'bold-header',
      sortable: isSortable,
    },
  ]

  const conceptColumn = {
    field: 'concept',
    headerName: 'Concept',
    width: 200,
    headerClassName: 'bold-header',
    sortable: isSortable,
  }

  const approvedColumn = {
    field: 'approved',
    headerName: 'Approved',
    width: 100,
    headerClassName: 'bold-header',
    sortable: isSortable,
    valueFormatter: params => (params ? 'Yes' : 'Pending'),
  }

  const processorColumns = [
    {
      field: 'processorName',
      headerName: 'Processor',
      width: 100,
      headerClassName: 'bold-header',
      sortable: isSortable,
    },
    {
      field: 'processedTimestamp',
      headerName: 'Processed',
      width: 165,
      headerClassName: 'bold-header',
      sortable: isSortable,
      valueFormatter: params => humanTimestamp(params),
    },
  ]

  const columns =
    type === 'concept'
      ? [baseColumns[0], approvedColumn, ...baseColumns.slice(1), ...processorColumns]
      : type === 'pending'
      ? [baseColumns[0], conceptColumn, ...baseColumns.slice(1)]
      : type === 'approved'
      ? [baseColumns[0], conceptColumn, ...baseColumns.slice(1), ...processorColumns]
      : [baseColumns[0], conceptColumn, ...baseColumns.slice(1)]

  return columns
}

export default useHistoryColumns
