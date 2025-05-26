import { use } from 'react'

import { Box, IconButton } from '@mui/material'

import InspectIcon from '@/components/common/InspectIcon'

import SelectedContext from '@/contexts/selected/SelectedContext'

const useHistoryColumns = ({ type }) => {
  const { select } = use(SelectedContext)

  const handleInspect = row => {
    select({ concept: row.concept, panel: 'Concepts' })
  }

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
            <IconButton
              size='small'
              onClick={() => handleInspect(params.row)}
              sx={{
                '&:hover': {
                  color: 'primary.main',
                  '& svg': {
                    transform: 'scale(1.2)',
                  },
                },
              }}
            >
              <InspectIcon />
            </IconButton>
          )}
        </Box>
      ),
    },
    { field: 'field', headerName: 'Field', width: 130, headerClassName: 'bold-header' },
    { field: 'action', headerName: 'Action', width: 130, headerClassName: 'bold-header' },
    { field: 'creatorName', headerName: 'Creator', width: 130, headerClassName: 'bold-header' },
    {
      field: 'creationTimestamp',
      headerName: 'Created',
      width: 180,
      headerClassName: 'bold-header',
    },
    { field: 'oldValue', headerName: 'Old Value', width: 200, headerClassName: 'bold-header' },
    { field: 'newValue', headerName: 'New Value', width: 200, headerClassName: 'bold-header' },
  ]

  const conceptColumn = {
    field: 'concept',
    headerName: 'Concept',
    width: 200,
    headerClassName: 'bold-header',
  }

  const approvedColumn = {
    field: 'approved',
    headerName: 'Approved',
    width: 100,
    headerClassName: 'bold-header',
    valueFormatter: params => (params ? 'Yes' : 'Pending'),
  }

  const columns =
    type === 'concept'
      ? [baseColumns[0], approvedColumn, ...baseColumns.slice(1)]
      : type === 'pending'
      ? [baseColumns[0], conceptColumn, ...baseColumns.slice(1)]
      : [baseColumns[0], conceptColumn, ...baseColumns.slice(1)]

  return columns
}

export default useHistoryColumns
