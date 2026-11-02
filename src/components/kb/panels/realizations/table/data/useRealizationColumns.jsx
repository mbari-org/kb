import { use, useMemo } from 'react'
import { Box } from '@mui/material'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDeleteForever } from 'react-icons/md'

import ActionIcon from '@/components/icon/ActionIcon'
import StampIcon from '@/components/icon/StampIcon'
import usePendingItemModal from '@/components/kb/panels/history/pending/usePendingItemModal'
import SelectedContext from '@/contexts/selected/SelectedContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import TemplateCell from '@/components/kb/panels/templates/table/data/TemplateCell'
import UserContext from '@/contexts/user/UserContext'

import { humanTimestamp } from '@/lib/utils'
import { SELECTED } from '@/lib/constants/selected.js'

const { REALIZATIONS } = SELECTED.SETTINGS

const useRealizationColumns = ({ deleteRealizationModal, editRealizationModal }) => {
  const { getPendingRealizationItem, updateFilters } = use(RealizationsContext)
  const { updateSelected } = use(SelectedContext)
  const { isAdmin } = use(UserContext)
  const openPendingItem = usePendingItemModal()

  return useMemo(
    () => [
      {
        field: 'actions',
        headerName: '',
        width: 100,
        sortable: false,
        headerClassName: 'bold-header',
        renderCell: params => {
          const pendingItem = getPendingRealizationItem(params.row)
          if (pendingItem) {
            if (!isAdmin) return null
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                <StampIcon
                  onClick={() => openPendingItem({ conceptName: pendingItem.concept, item: pendingItem })}
                  sx={{ mr: 1 }}
                  tooltip='Approve/Reject'
                />
              </Box>
            )
          }

          return (
            <Box>
              <ActionIcon
                color='cancel'
                Icon={MdOutlineDeleteForever}
                onClick={() => deleteRealizationModal(params.row)}
                restrictReadOnly
                size={24}
                sx={{ mr: 1 }}
              />
              <ActionIcon
                color='edit'
                Icon={CiEdit}
                onClick={() => editRealizationModal(params.row)}
                restrictReadOnly
                size={24}
              />
            </Box>
          )
        },
      },
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
    ],
    [
      deleteRealizationModal,
      editRealizationModal,
      getPendingRealizationItem,
      isAdmin,
      openPendingItem,
      updateFilters,
      updateSelected,
    ]
  )
}

export default useRealizationColumns
