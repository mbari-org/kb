import { Box, IconButton } from '@mui/material'
import InspectIcon from '@/components/common/InspectIcon'
import { use } from 'react'
import SelectedContext from '@/contexts/selected/SelectedContext'
import { humanTimestamp } from '@/lib/util'

const useTemplateColumns = () => {
  const { select } = use(SelectedContext)

  const handleInspect = row => {
    select({ concept: row.concept, panel: 'Concepts' })
  }

  const columns = [
    {
      field: 'inspect',
      headerName: '',
      width: 50,
      sortable: false,
      headerClassName: 'bold-header',
      renderCell: params => (
        <Box>
          <IconButton
            size='small'
            onClick={() => handleInspect(params.row)}
            sx={{
              '&:hover': {
                color: 'primary.main',
                '& svg': {
                  transform: 'scale(1.2)',
                },
              },
            }}
          >
            <InspectIcon />
          </IconButton>
        </Box>
      ),
    },
    { field: 'concept', headerName: 'Concept', width: 200, headerClassName: 'bold-header' },
    { field: 'linkName', headerName: 'Link Name', width: 150, headerClassName: 'bold-header' },
    { field: 'toConcept', headerName: 'To Concept', width: 150, headerClassName: 'bold-header' },
    { field: 'linkValue', headerName: 'Link Value', width: 150, headerClassName: 'bold-header' },
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
