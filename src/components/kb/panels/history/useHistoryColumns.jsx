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

const SORTING_ORDER = ['asc', 'desc']

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

  const sortableFields = [
    'action',
    ...(type === TYPE.PENDING ? ['concept'] : []),
    'creationTimestamp',
    'creatorName',
    'field',
    'newValue',
    'oldValue',
    ...(type !== TYPE.PENDING ? ['processedTimestamp', 'processorName'] : []),
  ]

  const sortableProps = field =>
    sortableFields.includes(field)
      ? { sortable: true, sortingOrder: SORTING_ORDER }
      : { sortable: false }

  const columnProps = (field, headerName, width) => ({
    field,
    headerClassName: 'bold-header',
    headerName,
    width,
    ...sortableProps(field),
  })

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
    columnProps('concept', 'Concept', 200),
    columnProps('field', 'Field', 130),
    columnProps('action', 'Action', 100),
    columnProps('creatorName', 'Creator', 130),
    {
      ...columnProps('creationTimestamp', 'Created', 165),
      valueFormatter: value => humanTimestamp(value),
    },
    columnProps('oldValue', 'Old Value', 200),
    columnProps('newValue', 'New Value', 200),
  ]

  const approvedColumn = {
    ...columnProps('approved', 'Approved', 100),
    renderCell: approvedCell,
  }

  const processorColumns = [
    columnProps('processorName', 'Processor', 100),
    {
      ...columnProps('processedTimestamp', 'Processed', 165),
      valueFormatter: value => humanTimestamp(value),
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
