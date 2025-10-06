import { use } from 'react'
import { Box } from '@mui/material'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDeleteForever } from 'react-icons/md'

import ActionIcon from '@/components/icon/ActionIcon'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import TemplateCell from './TemplateCell'

import { humanTimestamp } from '@/lib/utils'
import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const useTemplateColumns = ({ deleteTemplateModal, editTemplateModal }) => {
  const { updateFilters } = use(TemplatesContext)

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box>
          <ActionIcon
            color='cancel'
            Icon={MdOutlineDeleteForever}
            onClick={() => deleteTemplateModal(params.row)}
            restrictReadOnly
            size={24}
            sx={{ mr: 1 }}
          />
          <ActionIcon
            color='edit'
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
      headerName: 'Concept',
      width: 175,
      headerClassName: 'bold-header',
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.CONCEPT, updateFilters }),
    },
    {
      field: 'linkName',
      headerName: 'Link Name',
      width: 175,
      headerClassName: 'bold-header',
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.LINK_NAME, updateFilters }),
    },
    {
      field: 'toConcept',
      headerName: 'To Concept',
      width: 175,
      headerClassName: 'bold-header',
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.TO_CONCEPT, updateFilters }),
    },
    {
      field: 'linkValue',
      headerName: 'Link Value',
      width: 250,
      headerClassName: 'bold-header',
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.LINK_VALUE, updateFilters }),
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      width: 165,
      headerClassName: 'bold-header',
      valueFormatter: value => humanTimestamp(value),
    },
  ]

  return columns
}

export default useTemplateColumns
