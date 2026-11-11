import { use, useMemo } from 'react'

import { Box, Link } from '@mui/material'

import { CiEdit } from 'react-icons/ci'
import { MdOutlineDeleteForever } from 'react-icons/md'

import ActionIcon from '@/components/icon/ActionIcon'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import useConceptHasPendingDelete from '@/lib/hooks/useConceptHasPendingDelete'
import { SELECTED } from '@/lib/constants/selected.js'

const useReferenceColumns = ({ deleteReferenceModal, editReferenceModal }) => {
  const { filters } = use(ReferencesContext)
  const hasPendingDelete = useConceptHasPendingDelete(filters[SELECTED.SETTINGS.REFERENCES.FILTERS.CONCEPT])

  const columns = useMemo(() => [
    {
      field: 'actions',
      width: 100, headerClassName: 'bold-header',
      headerName: '',
      renderCell: params => !hasPendingDelete && (
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
          <Link href={params.value} rel='noopener noreferrer' target='_blank'>
            {params.value}
          </Link>
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
  ], [deleteReferenceModal, editReferenceModal, hasPendingDelete])

  return columns
}

export default useReferenceColumns
