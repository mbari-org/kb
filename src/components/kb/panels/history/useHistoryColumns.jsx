import { use } from 'react'

import { Box } from '@mui/material'

import InspectIcon from '@/components/icon/InspectIcon'
import StampIcon from '@/components/icon/StampIcon'

import usePendingItemModal from '@/components/kb/panels/history/pending/usePendingItemModal'

import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { isAdmin } from '@/lib/auth/role'

import { humanTimestamp } from '@/lib/utils'

import { CONCEPT_HISTORY, SELECTED } from '@/lib/constants'

const { TYPE } = CONCEPT_HISTORY

const useHistoryColumns = ({ type }) => {
  const openPendingItem = usePendingItemModal()
  const { updateSelected } = use(SelectedContext)
  const { user } = use(UserContext)

  const isAdminUser = isAdmin(user)

  const handleConceptInspect = row => {
    updateSelected({ [SELECTED.CONCEPT]: row.concept, [SELECTED.PANEL]: SELECTED.PANELS.CONCEPTS })
  }
  const handleConceptApproval = row => {
    if (row?.id) {
      openPendingItem({ conceptName: row.concept, item: row })
    }
  }

  const isSortable = type === TYPE.CONCEPT

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
    return {
      field: 'inspect',
      onClick: handleConceptInspect,
      renderCell: params => (
        <Box>
          <InspectIcon
            onClick={() => handleConceptInspect(params.row)}
            tooltip='View this Concept'
          />
        </Box>
      ),
      tooltip: 'View this Concept',
      headerName: '',
      sortable: false,
      width: 50,
    }
  }

  const baseColumns = [
    {
      field: 'concept',
      headerClassName: 'bold-header',
      headerName: 'Concept',
      sortable: isSortable,
      width: 200,
    },
    {
      field: 'field',
      headerClassName: 'bold-header',
      headerName: 'Field',
      sortable: isSortable,
      width: 130,
    },
    {
      field: 'action',
      headerClassName: 'bold-header',
      headerName: 'Action',
      sortable: isSortable,
      width: 100,
    },
    {
      field: 'creatorName',
      headerClassName: 'bold-header',
      headerName: 'Creator',
      sortable: isSortable,
      width: 130,
    },
    {
      field: 'creationTimestamp',
      headerClassName: 'bold-header',
      headerName: 'Created',
      sortable: isSortable,
      valueFormatter: value => humanTimestamp(value),
      width: 165,
    },
    {
      field: 'oldValue',
      headerClassName: 'bold-header',
      headerName: 'Old Value',
      sortable: isSortable,
      width: 200,
    },
    {
      field: 'newValue',
      headerClassName: 'bold-header',
      headerName: 'New Value',
      sortable: isSortable,
      width: 200,
    },
  ]

  const approvedColumn = {
    field: 'approved',
    headerClassName: 'bold-header',
    headerName: 'Approved',
    sortable: isSortable,
    renderCell: approvedCell,
    width: 100,
  }

  const processorColumns = [
    {
      field: 'processorName',
      headerClassName: 'bold-header',
      headerName: 'Processor',
      sortable: isSortable,
      width: 100,
    },
    {
      field: 'processedTimestamp',
      headerClassName: 'bold-header',
      headerName: 'Processed',
      sortable: isSortable,
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
