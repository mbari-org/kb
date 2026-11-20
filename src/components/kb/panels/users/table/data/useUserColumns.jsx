import { useMemo } from 'react'

import { Box } from '@mui/material'

import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'

import ActionIcon from '@/components/icon/ActionIcon'

import { ROLES } from '@/lib/constants'
import CONFIG from '@/lib/config'

import { humanTimestamp } from '@/lib/utils'

const { CHOICE, FIELDS } = CONFIG
const { AFFILIATION, EMAIL, FIRST_NAME, LAST_NAME, LOCKED, LAST_UPDATED, ROLE, USERNAME } = FIELDS.USER

const useUserColumns = ({ editUserModal, lockUserModal }) => {
  const lockTooltip = locked =>
    locked ? CONFIG.PANELS.USERS.PANEL.TOOLTIP.UNLOCK : CONFIG.PANELS.USERS.PANEL.TOOLTIP.LOCK

  const columns = useMemo(() => [
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box>
          <ActionIcon
            Icon={params.row.locked ? AiOutlineLock : AiOutlineUnlock}
            onClick={() => lockUserModal(params.row)}
            tooltip={lockTooltip(params.row.locked)}
            iconAction={params.row.locked ? 'ADD' : 'DELETE'}
            size={22}
            sx={{ mr: 1 }}
          />

          <Box component='span' sx={{ display: 'inline-flex', visibility: params.row.locked ? 'hidden' : 'visible' }}>
            <ActionIcon
              Icon={CiEdit}
              onClick={() => editUserModal(params.row)}
              tooltip={CONFIG.PANELS.USERS.PANEL.TOOLTIP.EDIT}
              iconAction='EDIT'
              size={24}
            />
          </Box>
        </Box>
      ),
    },
    {
      field: USERNAME,
      headerName: 'Username',
      width: 130,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: ROLE,
      headerName: 'Role',
      width: 130,
      type: 'singleSelect',
      valueOptions: Object.values(ROLES),
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: AFFILIATION,
      headerName: 'Affiliation',
      width: 130,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: FIRST_NAME,
      headerName: 'First Name',
      width: 130,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: LAST_NAME,
      headerName: 'Last Name',
      width: 130,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: EMAIL,
      headerName: 'Email',
      width: 200,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
    },
    {
      field: LOCKED,
      headerName: 'Locked',
      width: 100,
      headerClassName: 'bold-header',
      valueGetter: value => (value ? CHOICE.YES : CHOICE.NO),
    },
    {
      field: LAST_UPDATED,
      headerName: 'Last Update',
      width: 250,
      headerClassName: 'bold-header',
      cellClassName: params => (params.row.locked ? 'disabled-cell' : ''),
      valueGetter: value => humanTimestamp(value),
    },
  ], [editUserModal, lockUserModal])

  return columns
}

export default useUserColumns
