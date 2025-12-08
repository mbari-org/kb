import { use } from 'react'
import { Box } from '@mui/material'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDeleteForever } from 'react-icons/md'

import ActionIcon from '@/components/icon/ActionIcon'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import TemplateCell from './TemplateCell'

import { humanTimestamp } from '@/lib/utils'
import { SELECTED } from '@/constants/selected.js'

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
      headerClassName: 'bold-header',
      headerName: 'Concept',
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.CONCEPT, updateFilters }),
      width: 175,
    },
    {
      field: 'linkName',
      headerClassName: 'bold-header',
      headerName: 'Link Name',
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.LINK_NAME, updateFilters }),
      width: 175,
    },
    {
      field: 'toConcept',
      headerClassName: 'bold-header',
      headerName: 'To Concept',
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.TO_CONCEPT, updateFilters }),
      width: 175,
    },
    {
      field: 'linkValue',
      headerClassName: 'bold-header',
      headerName: 'Link Value',
      renderCell: TemplateCell({ filterKey: TEMPLATES.FILTERS.LINK_VALUE, updateFilters }),
      width: 250,

    },
    {
      field: 'lastUpdated',
      headerClassName: 'bold-header',
      headerName: 'Last Updated',
      valueFormatter: value => humanTimestamp(value),
      width: 165,
    },
  ]

  return columns
}

export default useTemplateColumns
