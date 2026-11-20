import { use, useMemo } from 'react'
import { Box } from '@mui/material'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDeleteForever } from 'react-icons/md'

import ActionIcon from '@/components/icon/ActionIcon'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import TemplateCell from './TemplateCell'

import { humanTimestamp } from '@/lib/utils'
import useConceptHasPendingDelete from '@/lib/hooks/useConceptHasPendingDelete'
import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/lib/config'

const { TEMPLATES } = SELECTED.SETTINGS
const { COLUMNS } = CONFIG.PANELS.TEMPLATES

const useTemplateColumns = ({ deleteTemplateModal, editTemplateModal }) => {
  const { filters, getPendingTemplateAction, updateFilters } = use(TemplatesContext)
  const { updateSelected } = use(SelectedContext)
  const { updateSettings } = use(SelectedSettingsContext)
  const hasPendingDelete = useConceptHasPendingDelete(filters[TEMPLATES.FILTERS.CONCEPT])

  const columns = useMemo(() => [
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params =>
        hasPendingDelete || getPendingTemplateAction(params.row) ? null : (
          <Box>
            <ActionIcon
              iconAction='DELETE'
              Icon={MdOutlineDeleteForever}
              onClick={() => deleteTemplateModal(params.row)}
              restrictReadOnly
              size={24}
              sx={{ mr: 1 }}
            />
            <ActionIcon
              iconAction='EDIT'
              Icon={CiEdit}
              onClick={() => editTemplateModal(params.row)}
              restrictReadOnly
              size={24}
            />
          </Box>
        ),
    },
    {
      field: 'concept',
      headerClassName: 'bold-header',
      headerName: COLUMNS.CONCEPT,
      renderCell: TemplateCell({
        filterKey: TEMPLATES.FILTERS.CONCEPT,
        updateFilters,
        onConceptClick: conceptName => {
          updateSelected({ [SELECTED.CONCEPT]: conceptName })
          updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.BY_AVAILABLE]: false } })
        },
      }),
      width: 175,
    },
    {
      field: 'linkName',
      headerClassName: 'bold-header',
      headerName: CONFIG.LINK.FIELDS.LINK_NAME,
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.LINK_NAME, updateFilters }),
      width: 175,
    },
    {
      field: 'toConcept',
      headerClassName: 'bold-header',
      headerName: CONFIG.LINK.FIELDS.TO_CONCEPT,
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.TO_CONCEPT, updateFilters }),
      width: 175,
    },
    {
      field: 'linkValue',
      headerClassName: 'bold-header',
      headerName: CONFIG.LINK.FIELDS.LINK_VALUE,
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.LINK_VALUE, updateFilters }),
      width: 250,

    },
    {
      field: 'lastUpdated',
      headerClassName: 'bold-header',
      headerName: COLUMNS.LAST_UPDATED,
      valueFormatter: value => humanTimestamp(value),
      width: 165,
    },
  ], [deleteTemplateModal, editTemplateModal, getPendingTemplateAction, hasPendingDelete, updateFilters, updateSelected, updateSettings])

  return columns
}

export default useTemplateColumns
