import { Box } from '@mui/material'

import { CiEdit } from 'react-icons/ci'
import { MdOutlineDeleteForever } from 'react-icons/md'

import ActionIcon from '@/components/icon/ActionIcon'

const useReferenceColumns = ({ deleteReferenceModal, editReferenceModal }) => {

  const columns = [
    {
      field: 'actions',
      width: 100, headerClassName: 'bold-header',
      headerName: '',
      renderCell: params => (
        <Box>
          <ActionIcon
            color='cancel'
            Icon={MdOutlineDeleteForever}
            onClick={() => deleteReferenceModal(params.row)}
            restrictReadOnly
            size={24}
            sx={{ mr: 1 }}
          />
          <ActionIcon
            color='edit'
            Icon={CiEdit}
            onClick={() => editReferenceModal(params.row)}
            restrictReadOnly
            size={24}
          />
        </Box>
      ),
      sortable: false,
    },
    {
      field: 'doi',
      headerClassName: 'bold-header',
      headerName: 'DOI',
      renderCell: params => (
        <Box
          sx={{
            py: 1,
          }}
        >
          {params.value}
        </Box>
      ),
      width: 200,
    },
    {
      field: 'citation',
      flex: 0.4,
      headerClassName: 'bold-header',
      headerName: 'Citation',
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
      flex: 0.4,
      headerName: 'Concepts',
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
      valueGetter: params => params.join(', ') || '',
    },
  ]

  return columns
}

export default useReferenceColumns
