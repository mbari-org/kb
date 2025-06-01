import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { CiEdit } from 'react-icons/ci'
import { MdOutlineDeleteForever } from 'react-icons/md'

const useReferenceColumns = ({ editReferenceModal, deleteReferenceModal }) => {
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
            onClick={() => deleteReferenceModal(params.row)}
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
            onClick={() => editReferenceModal(params.row)}
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
    {
      field: 'doi',
      headerName: 'DOI',
      width: 200,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box
          sx={{
            py: 1,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'citation',
      headerName: 'Citation',
      flex: 0.4,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box
          sx={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            py: 1,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'concepts',
      headerName: 'Concepts',
      flex: 0.4,
      headerClassName: 'bold-header',
      valueGetter: params => params.join(', ') || '',
      renderCell: params => (
        <Box
          sx={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            py: 1,
          }}
        >
          {params.value}
        </Box>
      ),
    },
  ]

  return columns
}

export default useReferenceColumns
