import { Box, IconButton } from '@mui/material'
import { use } from 'react'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDeleteForever } from 'react-icons/md'
import { useTheme } from '@mui/material/styles'
import { humanTimestamp } from '@/lib/utils'

const useTemplateColumns = ({ deleteTemplateModal, editTemplateModal }) => {
  const theme = useTheme()

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box>
          <IconButton
            size='small'
            onClick={() => deleteTemplateModal(params.row)}
            sx={{
              mr: 1,
              '&:hover': {
                color: 'error.main',
                ...theme.kb.icon.hover,
              },
            }}
          >
            <MdOutlineDeleteForever size={24} />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => editTemplateModal(params.row)}
            sx={{
              '&:hover': {
                color: 'edit.main',
                ...theme.kb.icon.hover,
              },
            }}
          >
            <CiEdit size={24} />
          </IconButton>
        </Box>
      ),
    },
    { field: 'concept', headerName: 'Concept', width: 175, headerClassName: 'bold-header' },
    { field: 'linkName', headerName: 'Link Name', width: 175, headerClassName: 'bold-header' },
    { field: 'toConcept', headerName: 'To Concept', width: 175, headerClassName: 'bold-header' },
    { field: 'linkValue', headerName: 'Link Value', width: 250, headerClassName: 'bold-header' },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      width: 165,
      headerClassName: 'bold-header',
      valueFormatter: params => humanTimestamp(params),
    },
  ]

  return columns
}

export default useTemplateColumns
