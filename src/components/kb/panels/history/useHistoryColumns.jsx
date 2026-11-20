import { use, useMemo } from 'react'

import { Box } from '@mui/material'

import StampIcon from '@/components/icon/StampIcon'
import KBTooltip from '@/components/common/tooltip/KBTooltip'

import usePendingItemModal from '@/components/kb/panels/history/pending/usePendingItemModal'

import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import UserContext from '@/contexts/user/UserContext'

import { humanTimestamp } from '@/lib/utils'

import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/lib/config'

const { CHOICE, UI } = CONFIG
const { TYPE } = CONCEPT.HISTORY
const { PANEL: HISTORY_PANEL, TYPE: TYPE_LABEL } = CONFIG.PANELS.HISTORY
const { COLUMNS: HISTORY_COLUMNS } = CONFIG.PANELS.HISTORY
const { HISTORY } = SELECTED.SETTINGS
const { HISTORY: HISTORY_FIELDS } = CONFIG.FIELDS
const { STAMP } = UI

const SORTING_ORDER = ['asc', 'desc']

const useHistoryColumns = ({ type }) => {
  const openPendingItem = usePendingItemModal()
  const { updateSelected } = use(SelectedContext)
  const { updateSettings } = use(SelectedSettingsContext)
  const { isAdmin } = use(UserContext)

  return useMemo(() => {
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
      HISTORY_FIELDS.ACTION,
      ...(type === TYPE.CONCEPT ? [HISTORY_FIELDS.APPROVED] : [HISTORY_FIELDS.CONCEPT]),
      HISTORY_FIELDS.CREATION_TIMESTAMP,
      HISTORY_FIELDS.CREATOR_NAME,
      HISTORY_FIELDS.FIELD,
      HISTORY_FIELDS.NEW_VALUE,
      HISTORY_FIELDS.OLD_VALUE,
      ...(type !== TYPE.PENDING ? [HISTORY_FIELDS.PROCESSED_TIMESTAMP, HISTORY_FIELDS.PROCESSOR_NAME] : []),
    ]

    const sortableProps = field =>
      sortableFields.includes(field) ? { sortable: true, sortingOrder: SORTING_ORDER } : { sortable: false }

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
      isPending && (content = <StampIcon onClick={() => handleConceptApproval(params.row)} tooltip={STAMP.TOOLTIP} />)
      !isPending && isApproved && (content = CHOICE.YES)
      !isPending && !isApproved && (content = CHOICE.NO)
      isPending && !isAdmin && (content = TYPE_LABEL.PENDING)

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>{content}</Box>
      )
    }

    const approvalColumn = {
      field: 'inspect',
      headerName: '',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StampIcon onClick={() => handleConceptApproval(params.row)} tooltip={STAMP.TOOLTIP} />
        </Box>
      ),
      sortable: false,
      width: 50,
    }

    const conceptLinkCell = params => (
      <KBTooltip title={HISTORY_PANEL.TOOLTIP.FILTER_CONCEPT} placement='top'>
        <Box
          component='span'
          onClick={() => handleConceptFilter(params.row)}
          sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          {params.value}
        </Box>
      </KBTooltip>
    )

    const conceptColumn =
      type !== TYPE.CONCEPT
        ? { ...columnProps(HISTORY_FIELDS.CONCEPT, HISTORY_COLUMNS.CONCEPT, 200), renderCell: conceptLinkCell }
        : columnProps(HISTORY_FIELDS.CONCEPT, HISTORY_COLUMNS.CONCEPT, 200)

    const baseColumns = [
      conceptColumn,
      columnProps(HISTORY_FIELDS.FIELD, HISTORY_COLUMNS.FIELD, 130),
      columnProps(HISTORY_FIELDS.ACTION, HISTORY_COLUMNS.ACTION, 100),
      columnProps(HISTORY_FIELDS.CREATOR_NAME, HISTORY_COLUMNS.CREATOR, 130),
      columnProps(HISTORY_FIELDS.OLD_VALUE, HISTORY_COLUMNS.OLD_VALUE, 200),
      columnProps(HISTORY_FIELDS.NEW_VALUE, HISTORY_COLUMNS.NEW_VALUE, 200),
      {
        ...columnProps(HISTORY_FIELDS.CREATION_TIMESTAMP, HISTORY_COLUMNS.CREATED, 165),
        valueFormatter: value => humanTimestamp(value),
      },
    ]

    const approvedColumn = {
      ...columnProps(HISTORY_FIELDS.APPROVED, HISTORY_COLUMNS.APPROVED, 100),
      renderCell: approvedCell,
    }

    const processorColumns = [
      columnProps(HISTORY_FIELDS.PROCESSOR_NAME, HISTORY_COLUMNS.PROCESSOR, 100),
      {
        ...columnProps(HISTORY_FIELDS.PROCESSED_TIMESTAMP, HISTORY_COLUMNS.PROCESSED, 165),
        valueFormatter: value => humanTimestamp(value),
      },
    ]

    return type === TYPE.PENDING
      ? [...(isAdmin ? [approvalColumn] : []), ...baseColumns]
      : type === TYPE.APPROVED
        ? [...baseColumns, ...processorColumns]
        : [approvedColumn, ...baseColumns, ...processorColumns]
  }, [isAdmin, openPendingItem, type, updateSelected, updateSettings])
}

export default useHistoryColumns
