import { use } from 'react'

import { Box } from '@mui/material'

import FilterIcon from '@/components/icon/FilterIcon'
import StampIcon from '@/components/icon/StampIcon'

import usePendingItemModal from '@/components/kb/panels/history/pending/usePendingItemModal'

import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { isAdmin } from '@/lib/auth/role'

import { humanTimestamp } from '@/lib/utils'

import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT } from '@/lib/constants'

const { TYPE } = CONCEPT.HISTORY
const { HISTORY } = SELECTED.SETTINGS

const useHistoryColumns = ({ type }) => {
  const openPendingItem = usePendingItemModal()
  const { updateSelected, updateSettings } = use(SelectedContext)
  const { user } = use(UserContext)

  const isAdminUser = isAdmin(user)

  const handleConceptApproval = row => {
    if (row?.id) {
      openPendingItem({ conceptName: row.concept, item: row })
    }
  }

  const handleConceptFilter = row => {
    updateSelected({ [SELECTED.CONCEPT]: row.concept })
    updateSettings({ [HISTORY.KEY]: { [HISTORY.TYPE]: TYPE.CONCEPT } })
  }

  const sortSpec =
    type === TYPE.CONCEPT
      ? {
          all: true,
          fields: {
            creationTimestamp: { sortingOrder: ['desc', 'asc'] },
          },
        }
      : type === TYPE.APPROVED || type === TYPE.PENDING
        ? {
            all: false,
            fields: {
              creationTimestamp: { sortingOrder: ['desc', 'asc'] },
              field: { sortingOrder: ['asc', 'desc'] },
            },
          }
        : { all: false, fields: {} }

  const isColumnSortable = field => sortSpec.all || !!sortSpec.fields[field]
  const sortingOrderFor = field => sortSpec.fields[field]?.sortingOrder

  const approvedCell = params => {
    const isPending = !params.row.processedTimestamp
    const isApproved = !!params.row.approved

    let content
    isPending &&
      (content = (
        <StampIcon onClick={() => handleConceptApproval(params.row)} tooltip='Approve/Reject' />
      ))
    !isPending && isApproved && (content = 'Yes')
    !isPending && !isApproved && (content = 'No')
    isPending && !isAdminUser && (content = 'Pending')

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {content}
      </Box>
    )
  }

  const inspectColumn = () => {
    const showPendingApproval = type === TYPE.PENDING && isAdminUser

    return {
      field: 'inspect',
      headerName: '',
      onClick: handleConceptFilter,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon
            onClick={() => handleConceptFilter(params.row)}
            tooltip='Filter History to this Concept'
          />
          {showPendingApproval && (
            <StampIcon
              onClick={() => handleConceptApproval(params.row)}
              tooltip='Approve/Reject'
            />
          )}
        </Box>
      ),
      sortable: false,
      width: showPendingApproval ? 90 : 50,
    }
  }

  const baseColumns = [
    {
      field: 'concept',
      headerClassName: 'bold-header',
      headerName: 'Concept',
      sortable: isColumnSortable('concept'),
      width: 200,
    },
    {
      field: 'field',
      headerClassName: 'bold-header',
      headerName: 'Field',
      sortable: isColumnSortable('field'),
      sortingOrder: sortingOrderFor('field'),
      width: 130,
    },
    {
      field: 'action',
      headerClassName: 'bold-header',
      headerName: 'Action',
      sortable: isColumnSortable('action'),
      width: 100,
    },
    {
      field: 'creatorName',
      headerClassName: 'bold-header',
      headerName: 'Creator',
      sortable: isColumnSortable('creatorName'),
      width: 130,
    },
    {
      field: 'creationTimestamp',
      headerClassName: 'bold-header',
      headerName: 'Created',
      sortable: isColumnSortable('creationTimestamp'),
      sortingOrder: sortingOrderFor('creationTimestamp'),
      valueFormatter: value => humanTimestamp(value),
      width: 165,
    },
    {
      field: 'oldValue',
      headerClassName: 'bold-header',
      headerName: 'Old Value',
      sortable: isColumnSortable('oldValue'),
      width: 200,
    },
    {
      field: 'newValue',
      headerClassName: 'bold-header',
      headerName: 'New Value',
      sortable: isColumnSortable('newValue'),
      width: 200,
    },
  ]

  const approvedColumn = {
    field: 'approved',
    headerClassName: 'bold-header',
    headerName: 'Approved',
    sortable: isColumnSortable('approved'),
    renderCell: approvedCell,
    width: 100,
  }

  const processorColumns = [
    {
      field: 'processorName',
      headerClassName: 'bold-header',
      headerName: 'Processor',
      sortable: isColumnSortable('processorName'),
      width: 100,
    },
    {
      field: 'processedTimestamp',
      headerClassName: 'bold-header',
      headerName: 'Processed',
      sortable: isColumnSortable('processedTimestamp'),
      valueFormatter: value => humanTimestamp(value),
      width: 165,
    },
  ]

  const columns =
    type === TYPE.PENDING
      ? [inspectColumn(), ...baseColumns]
      : type === TYPE.APPROVED
        ? [inspectColumn(), ...baseColumns, ...processorColumns]
        : [approvedColumn, ...baseColumns, ...processorColumns]

  return columns
}

export default useHistoryColumns
